from __future__ import print_function
import PIL
from PIL import Image
import numpy as np
from scipy.misc import toimage
import matplotlib.pylab as plt
import glob, re, tqdm, os

# REQUIREMENTS
# requires Python 3
# to install required packages, run in terminal: pip install pillow numpy scipy matplotlib tqm

# interesting icons guidelines:
# Microsoft: https://docs.microsoft.com/en-us/office/dev/add-ins/design/design-icons
# Google's material design: https://material.io/guidelines/style/icons.html#icons-system-icons

# PARAMETERS
SIZE_RESIZE = 512
PAD = 20
ALPHATHRESHOLD = 80

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

def addborder(img):
    """
        -> Add black border of 1px all around image (no extend, just fill-in)
        Input:
            - img:              PIL object      image to add border to
        Output:
            - new_img:          PIL object      image with border
    """
    # convert to np array for convenience
    imgnp = np.array(img)
    # add black borders on each border
    imgnp[0, :] = [0,0,0,100]
    imgnp[img.size[0]-1, :] = [0,0,0,100]
    imgnp[:, 0] = [0,0,0,100]
    imgnp[:, img.size[1]-1] = [0,0,0,100]
    # return back PIL object
    return Image.fromarray(imgnp)

def resize(path, compare=False, savepath=None):
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
    # for optional comparison
    if compare or savepath:
        # ressource: https://stackoverflow.com/questions/30227466/combine-several-images-horizontally-with-python
        images = [img, new_img]
        widths, heights = zip(*(i.size for i in images))
        total_width = sum(widths)
        max_height = max(heights)
        compimg = Image.new('RGBA', (total_width, max_height), color=(255, 0, 255, 255))
        x_offset = 0
        for im in images:
            im = addborder(im)
            compimg.paste(im, (x_offset,0), im)
            x_offset += im.size[0]
        if compare:
            compimg.show()
        if savepath:
            # add directories if not present
            folderpath = os.path.join(os.getcwd(),savepath)
            if not os.path.exists(folderpath):
                os.makedirs(folderpath)
                os.makedirs(os.path.join(folderpath, 'compare/'))
                os.makedirs(os.path.join(folderpath, 'icons/'))

            # save
            name = re.search('((?!/).)*\.png$', path).group()
            compimg.save(savepath+'compare/'+name)
            new_img.save(savepath+'icons/'+name)

    return new_img

# -> loop over all icons (about 1s/icon)
for path in tqdm.tqdm(glob.iglob('../apps/**/*.png', recursive=True)):
    new_img = resize(path, compare=False, savepath="icons/")

# # -> test image per image
# path = "../apps/crackle/crackle-icon.png"
# path2 = "../apps/aliexpress/aliexpress-icon.png"
# new_img = resize(path, compare=True)
