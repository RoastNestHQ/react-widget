import React, { useEffect } from 'react';
import { ReferralWidgetProps } from './types';
import { DEFAULT_WIDGET_PROPS } from './defaults';
import { buildStyles } from './styles';
import { useReferralWidget } from '../../hooks/useReferralWidget';
import ReferralButton from '../ReferralButton';
import ReferralPopup from '../ReferralPopup';
import ReferralCard from '../ReferralCard';

export const ReferralWidget: React.FC<ReferralWidgetProps> = (userProps) => {
  const props = { ...DEFAULT_WIDGET_PROPS, ...userProps };
  const styles = buildStyles(props.theme);
  const widgetState = useReferralWidget(props);

  useEffect(() => {
    props.onMount?.(props.projectId);
  }, [props.projectId]);

  if (props.renderTrigger) {
    return (
      <>
        {props.customCSS && <style>{props.customCSS}</style>}
        {props.renderTrigger({
          open: widgetState.open,
          isOpen: widgetState.isOpen,
          projectId: props.projectId
        })}
        {widgetState.isOpen && (
          <ReferralPopup isOpen={widgetState.isOpen} onClose={widgetState.close} backdropStyle={styles.backdrop} popupStyle={styles.popup} closeOnBackdropClick={props.closeOnBackdropClick}>
            {props.renderCard ? props.renderCard({
              code: props.referralCode,
              link: props.referralLink,
              projectId: props.projectId,
              onCopyCode: widgetState.copyCode,
              onCopyLink: widgetState.copyLink,
              onShare: widgetState.share
            }) : (
              <ReferralCard
                {...props}
                styles={styles}
                codeCopied={widgetState.codeCopied}
                linkCopied={widgetState.linkCopied}
                onCopyCode={widgetState.copyCode}
                onCopyLink={widgetState.copyLink}
                onShare={widgetState.share}
              />
            )}
          </ReferralPopup>
        )}
      </>
    );
  }

  return (
    <>
      {props.customCSS && <style>{props.customCSS}</style>}
      <ReferralButton 
        position={props.buttonPosition!} 
        onClick={widgetState.open}
        label={props.buttonLabel}
        icon={props.buttonIcon}
        style={props.buttonStyle}
        themeStyles={styles}
      />
      
      <ReferralPopup isOpen={widgetState.isOpen} onClose={widgetState.close} backdropStyle={styles.backdrop} popupStyle={styles.popup} closeOnBackdropClick={props.closeOnBackdropClick}>
        {props.renderCard ? props.renderCard({
          code: props.referralCode,
          link: props.referralLink,
          projectId: props.projectId,
          onCopyCode: widgetState.copyCode,
          onCopyLink: widgetState.copyLink,
          onShare: widgetState.share
        }) : (
          <ReferralCard
            {...props}
            styles={styles}
            codeCopied={widgetState.codeCopied}
            linkCopied={widgetState.linkCopied}
            onCopyCode={widgetState.copyCode}
            onCopyLink={widgetState.copyLink}
            onShare={widgetState.share}
          />
        )}
      </ReferralPopup>
    </>
  );
};
