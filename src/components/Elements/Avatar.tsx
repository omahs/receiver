import React, { FunctionComponent, useRef } from 'react';
import Blockies from 'react-blockies';
import {
  useLensProfile,
  isEthAddress,
  useInView,
  useEnsAddress,
  useEnsAvatar,
  addressFromProfile,
} from '../../hooks';
import { motion } from 'framer-motion';

export interface AvatarProps {
  handle: string | null | undefined;
  onClick: () => unknown;
  size?: 'm' | 'l' | 'xl';
}

export const Avatar: FunctionComponent<AvatarProps> = ({
  handle,
  onClick,
  size,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const lensProfile = useLensProfile({
    handle,
  });
  const lensAddress =
    lensProfile.data !== null &&
    lensProfile.data !== undefined &&
    isEthAddress(addressFromProfile(lensProfile.data))
      ? addressFromProfile(lensProfile.data)
      : undefined;
  const ensAddress = useEnsAddress({
    handle,
    wait: isInView === false,
  });
  const ensAvatar = useEnsAvatar({
    handle: isEthAddress(handle)
      ? handle
      : isEthAddress(lensAddress)
      ? lensAddress
      : isEthAddress(ensAddress.data)
      ? ensAddress.data
      : undefined,
    wait: isInView === false,
  });

  if (!ensAvatar.data) {
    return (
      <div
        ref={ref}
        style={{ opacity: ensAvatar.isLoading ? 0.2 : 1 }}
        className={`Avatar BlockiesContainer size-${size}`}
        onClick={onClick}>
        <Blockies
          seed={handle || 'no address'}
          size={10}
          scale={size === 'xl' ? 7.5 : size === 'l' ? 5 : 4}
          className={'circle'}
        />
      </div>
    );
  } else {
    return (
      <motion.img
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0 }}
        className={`Avatar AvatarImage size-${size}`}
        onClick={onClick}
        src={ensAvatar.data}
        alt="user"
      />
    );
  }
};
