import sys, PIL, re, os
from PIL import Image
import numpy as np

# REQUIREMENTS
# requires Python 3
# to install required packages, run in terminal: pip install pillow numpy scipy matplotlib tqm

# USE IN TERMINAL
# Implicit call:
# -> $ python3 fixicon.py 'path2icon' SIZE_RESIZE PAD
# Explicit call:
# -> $ python3 fixicon.py -path 'path' -size SIZE_RESIZE -pad PAD
# SIZE_RESIZE and PAD are optionals in both cases.

# interesting icons guidelines:
# Microsoft: https://docs.microsoft.com/en-us/office/dev/add-ins/design/design-icons
# Google's material design: https://material.io/guidelines/style/icons.html#icons-system-icons

# DEFAULT PARAMETERS
SIZE_RESIZE = 512
PAD = 20
ALPHATHRESHOLD = 80
RATIO_MAX = 1.75 # corresponds to 75% upscale

# SCRIPT
def loadimage(path):
    """
        -> Load image from path. Load in PIL object and also convert to numpy array.
        Input:
            - path:             string      relative path to image
        Output:
            - images:           list        PIl image and numpy array version of image
    """
    img = Image.open(path).convert("RGBA") #force RGBA if image is only RGB
    im = np.array(img.getdata())
    im = im.reshape((img.size[0], img.size[1], 4)) # convert to 3D-tensor with RGBA channels
    return [img, im]

def locateborders(imgnp, alphathreshold=0):
    """
        -> Find location of top left border and square side size that defines the square region on non-empty pixels.
        Input:
            - imgnp:            np.array    RGBA image (shape: (h,w,4))
            - alphathreshold:   int         threshold value of pixel after which the alpha channel is not transparent
        Output:
            - borders:          list        list of x,y of upper left corner and size of side for with and without shadow icons.
    """
    # 1. Find image with shadow
    notempty = np.where(imgnp[:,:,3]>0)
    minr, maxr, minc, maxc = min(notempty[0]), max(notempty[0]), min(notempty[1]), max(notempty[1])
    imageshadow = [minc, minr, maxc-minc, maxr-minr]

    # 2. Find image without shadow
    notempty2 = np.where(imgnp[:,:,3]>alphathreshold)
    minr, maxr, minc, maxc = min(notempty2[0]), max(notempty2[0]), min(notempty2[1]), max(notempty2[1])
    imageinimgshad = [minc-imageshadow[0], minr-imageshadow[1], maxc-minc, maxr-minr]

    # 3. Return image with shadow dimensions and image in image shadow attributes
    return [imageshadow, imageinimgshad]

def resizeicon(img, borders, size = 512, pad = 12, verbose=False):
    """
        -> Take icon with shadows and resize according to non-shadow part of icon. Then fit icon according to size  and padding of image.
        Input:
            - img:              PIL object      original RGBA image to resize
            - borders:          list            list of x,y of upper left corner and size of side for with and without shadow icons.
            - size:             int             size of final icon in pixel, default to 512px.
            - pad:              int             icon one-side padding in pixel, default to 12px.
            - verbose:          bool            True for debugging info, default to False.
        Output:
            - new_img:          PIl object      formatted image
    """
    # 1. Crop icon to borders
    x, y, w, h = borders[0]
    dim_in = borders[1][2:]
    deltaw, deltah = borders[1][:2]
    img = img.crop((x, y, x+w, y+h))

    if verbose:
        img.show()
        print ("Imageshadow: upper left ({},{}), size ({},{})\nImagenishadow: size ({},{}) deltas ({},{})".format(x,y,w,h,dim_in[0],dim_in[1],deltaw,deltah))
    # 2. Resize to size minus padding
    # ressource: https://jdhao.github.io/2017/11/06/resize-image-to-square-with-padding/
    scale_size = size-2*pad
    old_size = img.size
    ratio = float(scale_size)/max(dim_in)

    # stop if ratio is higher than RATIO_MAX
    if ratio > RATIO_MAX:
        sys.exit("Ratio of {} > {} limit. Icon detected with size {}x{}px wouldn't look sharp enough in target {}x{}px resolution. Either increase the ratio max in python script or change icon.".format(ratio, RATIO_MAX, old_size[0], old_size[1], SIZE_RESIZE, SIZE_RESIZE))

    new_size = tuple([int(x*ratio) for x in old_size])
    img = img.resize(new_size, Image.BILINEAR)

    if verbose:
        print ("Imageresized: size ({},{}), ratio: {}".format(img.size[0], img.size[1], ratio))

    # 3. Create a new image and paste the resized on it
    new_img = Image.new("RGBA", (size, size))
    if np.where(dim_in==np.max(dim_in))[0][0]==1:
        # means height is max, so find delta in width
        new_img.paste(img, (int(pad+(scale_size//2-np.min(dim_in)*ratio//2)-deltaw*ratio), int(pad-deltah*ratio)))
    else:
        # means width is max, so find delta in height
        new_img.paste(img, (int(pad-deltaw*ratio), int(pad+(scale_size//2-np.min(dim_in)*ratio//2)-deltah*ratio)))

    return new_img

def resize(path):
    """
        -> Final function that compile all modules together. From path to formatted image according to PARAMETERS. Also possibility to show and/or save comparison between original and formatted images.
        Input:
            - path:             string          relative path to image
            - compare:          bool            True if comparison image is shown, default to False
            - savepath:         string          Path to locate saving folder if comparison image is saved, default to None
        Output:
            - new_img:          PIl object      formatted image
    """
    # load, find borders and resize
    img, imgnp = loadimage(path)
    borders = locateborders(imgnp, ALPHATHRESHOLD)
    new_img = resizeicon(img, borders, SIZE_RESIZE, PAD, verbose=False)

    return new_img

if __name__ == "__main__":
    # ARGUMENTS
    n = len(sys.argv)
    # if arguments given with modifiers '-...'
    if "-path" in sys.argv or "-size" in sys.argv or "-pad" in sys.argv:
        for i in np.arange(1,n,2) :
            mod, arg = sys.argv[i], sys.argv[i+1]
            print (mod)
            print (arg)
            if mod=="-path":
                PATH = arg
            elif mod=="-size":
                SIZE_RESIZE = int(arg)
            elif mod=="-pad":
                PAD = int(arg)
            else:
                print ()
                sys.exit("argument unknown: '{}'. Needs to comply with '-path', '-size' or '-pad'.".format(mod))
    # else arguments assumed to be given as sequence
    else:
        if n < 2:
            sys.exit("Needs at least the path to icon as an argument.")
        if n>1 and sys.argv[1]:
            PATH = sys.argv[1]
        if n>2 and sys.argv[2]:
            SIZE_RESIZE = int(sys.argv[2])
        if n>3 and sys.argv[3]:
            PAD = int(sys.argv[3])
        if n>4 and sys.argv[4]:
            sys.exit("argument(s) unknown: '{}'. Needs to comply with arguments sequence python3 fix.py 'path' 'size' 'pad.'".format(str(sys.argv[4:])))

    # RUN FIX
    new_img = resize(PATH)
    # SAVE WITH ADDED '-fixed' TO PATH
    newpath = re.sub(".png$", "-fixed.png", PATH)
    new_img.save(newpath)
    # PRINT DONE MSG
    print ("Done. Formatted icon saved at '{}' with output size {}x{}px and padding {}px.".format(newpath, SIZE_RESIZE, SIZE_RESIZE, PAD))
