/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog,
  DialogContent,
  IconButton,
  Link,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';

import HelpIcon from '@material-ui/icons/Help';

import ReactMarkdown from 'react-markdown';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import extractHostname from '../../helpers/extract-hostname';
import generateUrlWithRef from '../../helpers/generate-url-with-ref';

import { close } from '../../state/dialog-catalog-app-details/actions';

import { requestOpenInBrowser } from '../../senders';

import AppCard from '../shared/app-card';
import LinkSharing from '../shared/link-sharing';
import getAssetPath from '../../helpers/get-asset';

const useStyle = makeStyles((theme) => ({
  dialogContent: {
    paddingBottom: theme.spacing(4),
  },
  status: {
    textAlign: 'center',
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  appDesc: {
    width: '100%',
  },
  appDescSection: {
    marginTop: theme.spacing(2),
    '& h5': {
      ...theme.typography.h6,
      margin: 0,
    },
    '& h5 + p': {
      marginTop: 0,
    },
  },
  legal: {
    marginTop: theme.spacing(1),
  },
  shareInput: {
    marginTop: theme.spacing(4),
  },
  appInfoName: {
    color: theme.palette.text.secondary,
  },
  helpButton: {
    marginLeft: theme.spacing(0.5),
    marginTop: -3,
  },
  ul: {
    margin: 0,
  },
  li: {
    marginLeft: '-0.8rem',
    cursor: 'pointer',
  },
}));

const DialogCatalogAppDetails = () => {
  const classes = useStyle();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogCatalogAppDetails.open);
  const details = useSelector((state) => state.dialogCatalogAppDetails.details);

  const {
    err,
    category,
    description,
    icon,
    icon256,
    id,
    name,
    relatedPaths,
    url,
    widevine,
  } = useMemo(() => (details || { }), [details]);
  const shareUrl = useMemo(() => details && ((!err && url) ? `https://webcatalog.io/webcatalog/apps/${id}/` : ''), [details]);
  const hostname = useMemo(() => details && extractHostname(url), [details]);

  const onClose = useCallback(() => dispatch(close()), [dispatch]);
  const onOpenUrl = useCallback((e) => {
    e.preventDefault();

    requestOpenInBrowser(generateUrlWithRef(url));
  }, [requestOpenInBrowser]);
  const onOpenClassification = useCallback(() => {
    requestOpenInBrowser('https://help.webcatalog.app/article/18-what-is-the-difference-between-standard-apps-and-multisite-apps');
  }, [requestOpenInBrowser]);
  const onOpenRelatedPath = useCallback((e, path) => {
    e.preventDefault();

    window.remote.shell.showItemInFolder(path);
  });

  return (
    <Dialog
      className={classes.root}
      onClose={onClose}
      open={open}
      fullWidth
    >
      <EnhancedDialogTitle onClose={onClose} />
      <DialogContent className={classes.dialogContent}>
        {details ? (
          <>
            {err ? (
              <Typography variant="body2" className={classes.status}>
                Failed to Load App Information.
              </Typography>
            ) : (
              <>
                <AppCard
                  id={id}
                  name={name}
                  url={url}
                  category={category}
                  widevine={widevine}
                  icon={icon}
                  iconThumbnail={getAssetPath(icon256)}
                  inDetailsDialog
                />
                <div className={classes.appDesc}>
                  <div className={classes.appDescSection}>
                    {url && (
                      <Typography variant="body2">
                        <span className={classes.appInfoName}>Website: </span>
                        <Link
                          href="#"
                          variant="body2"
                          onClick={onOpenUrl}
                        >
                          {hostname}
                        </Link>
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <span className={classes.appInfoName}>Classification: </span>
                      {url ? 'App' : 'Space'}

                      <Tooltip title="What is this?" placement="right">
                        <IconButton
                          size="small"
                          aria-label="What is this?"
                          classes={{ root: classes.helpButton }}
                          onClick={onOpenClassification}
                        >
                          <HelpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    {category && (
                      <Typography variant="body2">
                        <span className={classes.appInfoName}>Category: </span>
                        {category}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <span className={classes.appInfoName}>ID: </span>
                      {id}
                    </Typography>
                    {relatedPaths && (
                      <Typography variant="body2" component="div">
                        <span className={classes.appInfoName}>Related Files & Directories: </span>
                        <ul className={classes.ul}>
                          {relatedPaths.map(({ path }) => (
                            <li
                              key={path}
                              className={classes.li}
                            >
                              <Link onClick={(e) => onOpenRelatedPath(e, path)}>
                                {path}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Typography>
                    )}

                    <Typography variant="body2" className={classes.appDescSection} component="div">
                      <ReactMarkdown linkTarget="_blank">
                        {description}
                      </ReactMarkdown>
                    </Typography>

                    {(url || id?.startsWith('group-')) && (
                      <Typography variant="body2" color="textSecondary" className={classes.legal}>
                        {`We are not affiliated, associated, authorized, endorsed by or in any way officially connected to ${name}${hostname ? ` (${hostname})` : ''}, except for the fact that we use their websites to develop and provide you this app. All product names, logos, and brands are property of their respective owners.`}
                      </Typography>
                    )}
                  </div>

                  {!id?.startsWith('custom-') && shareUrl && (
                    <LinkSharing url={shareUrl} className={classes.shareInput} />
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <Typography
            className={classes.status}
            variant="body2"
          >
            Loading...
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogCatalogAppDetails;
