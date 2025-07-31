'use client';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { useRef } from 'react';

export default function StyledConnectButton() {
  const { connected, connecting, disconnect, account } = useWallet();
  const hiddenButtonRef = useRef<HTMLDivElement>(null);
  
   
  const getTruncatedAddress = () => {
    if (!account?.address) return '';
    const address = account.address;
    return `${address.slice(0, 4)}***${address.slice(-3)}`;
  };

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      // Trigger the hidden ConnectButton
      const button = hiddenButtonRef.current?.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  return (
    <>
      {/* Hidden default ConnectButton for wallet selection functionality */}
      <div ref={hiddenButtonRef} style={{ display: 'none' }}>
        <ConnectButton />
      </div>
      
      {/* Your custom styled button */}
      <button 
        onClick={handleClick}
        disabled={connecting}
        style={{
          background: '#2B7FFF',
          border: 'none',
          color: 'white',
          minWidth: '120px',
          maxWidth: '200px',
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '8px',
          cursor: connecting ? 'not-allowed' : 'pointer',
          opacity: connecting ? 0.7 : 1,
          fontWeight: '500',
        }}
      >
        {connecting ? 'Connecting...' : connected ? getTruncatedAddress() : 'Connect Wallet'}
      </button>
    </>
  );
}
