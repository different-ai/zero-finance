'use client';

import Link from 'next/link';
import React from 'react';

type BiosContainerProps = {
  children?: React.ReactNode;
};

export function BiosContainer({ children }: BiosContainerProps) {
  return (
    <div
      className="bios-container"
      style={{
        marginBottom: '0',
        overflow: 'auto',
        color: '#0000aa',
        backgroundColor: '#aaaaaa',
        borderRadius: '0px',
        border: '2px solid #000088',
        fontFamily: '"Perfect DOS VGA", "Courier New", monospace',
        letterSpacing: '1px',
      }}
    >
    
      <div 
        className="bios-nav"
        style={{
          backgroundColor: '#0000aa',
          color: 'white',
          display: 'flex',
          borderBottom: 'none',
          fontFamily: '"Perfect DOS VGA", "Courier New", monospace',
        }}
      >
        <div 
          className="bios-nav-item active"
          style={{
            padding: '4px 12px',
            backgroundColor: '#aaaaaa',
            color: '#0000aa',
            fontWeight: 'bold',
            fontFamily: '"Perfect DOS VGA", "Courier New", monospace',
            margin: '2px 0px 0px 2px'
          }}
        >
          Main
        </div>
      </div>

      <div 
        className="bios-content"
        style={{
          padding: '16px',
          fontFamily: '"Perfect DOS VGA", "Courier New", monospace',
        }}
      >
        <div 
          className="bios-box"
          style={{
            marginBottom: '24px',
            padding: '16px',
            border: '1px solid #0000aa',
            fontFamily: '"Perfect DOS VGA", "Courier New", monospace',
          }}
        >
          <h1
            className="main-title"
            style={{
              fontSize: '32px',
              color: '#0000aa',
              textTransform: 'uppercase',
              textAlign: 'center',
              margin: '0 0 16px 0',
              fontFamily: '"Perfect DOS VGA", "Courier New", monospace',
              fontWeight: 'bold',
            }}
          >
            Managing finances shouldn&apos;t feel like this
          </h1>

          <p style={{ margin: '12px 0', lineHeight: '1.5', fontFamily: '"Perfect DOS VGA", "Courier New", monospace', color: '#0000aa' }}>
            Managing personal finances usually means manually invoicing, allocating taxes, and trying to earn yield on idle cash. Traditional banks and apps don&apos;t handle this complexity well, leading to repetitive, tedious tasks.
          </p>

          <p style={{ margin: '12px 0', lineHeight: '1.5', fontFamily: '"Perfect DOS VGA", "Courier New", monospace', color: '#0000aa' }}>
            hyperstable is a new type of bank account built with AI agents and crypto rails, designed specifically to automate these daily financial tasks for you—from invoicing and tax allocations to yield strategies and compliance.
          </p>

          <p style={{ margin: '12px 0', lineHeight: '1.5', fontFamily: '"Perfect DOS VGA", "Courier New", monospace', color: '#0000aa' }}>
            It&apos;s not another budgeting app, and it doesn&apos;t connect to your existing bank—it <span style={{ backgroundColor: '#0000aa', color: '#aaaaaa', padding: '0 2px' }}>is</span> your bank account.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
} 