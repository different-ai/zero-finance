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
        maxHeight: '70vh',
        overflow: 'auto',
        color: '#0000aa',
        backgroundColor: '#aaaaaa',
        borderRadius: '4px',
        border: '2px solid #000088',
        fontFamily: 'Courier New, monospace',
      }}
    >
    

      <div 
        className="bios-nav"
        style={{
          backgroundColor: '#0000aa',
          color: 'white',
          display: 'flex',
          fontFamily: 'Courier New, monospace',
        }}
      >
        <div 
          className="bios-nav-item active"
          style={{
            padding: '6px 16px',
            backgroundColor: '#aaaaaa',
            color: '#0000aa',
            fontWeight: 'bold',
            fontFamily: 'Courier New, monospace',
          }}
        >
          Main
        </div>
      </div>

      <div 
        className="bios-content"
        style={{
          padding: '16px',
          fontFamily: 'Courier New, monospace',
        }}
      >
        <div 
          className="bios-box"
          style={{
            marginBottom: '24px',
            padding: '16px',
            border: '1px solid #0000aa',
            fontFamily: 'Courier New, monospace',
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
              fontFamily: 'Courier New, monospace',
            }}
          >
            Put your financial admin on autopilot
          </h1>

          <p style={{ margin: '12px 0', lineHeight: '1.5', fontFamily: 'Courier New, monospace' }}>
            You waste hours every month on repetitive financial tasks: creating invoices, managing taxes, allocating funds, and hunting for yield. These tasks are tedious, error-prone, and drain your energy.
          </p>

          <p style={{ margin: '12px 0', lineHeight: '1.5', fontFamily: 'Courier New, monospace' }}>
            hyprsqrl automates your entire financial stack—generating invoices, instantly setting aside money for taxes, optimizing your idle funds for yield, and keeping everything compliant—all powered by AI on seamless crypto rails.
          </p>

          <p style={{ margin: '12px 0', lineHeight: '1.5', fontFamily: 'Courier New, monospace' }}>
            If you're already using crypto, you'll be among the first to experience truly automated personal finance.
          </p>
        </div>

        {/* Latest Updates Section */}
        <div 
          className="bios-box"
          style={{
            padding: '16px',
            border: '1px solid #0000aa',
            fontFamily: 'Courier New, monospace',
          }}
        >
          <h2 
            className="latest-updates-title"
            style={{
              fontSize: '18px',
              color: '#0000aa',
              marginBottom: '16px',
              borderBottom: '1px dashed #0000aa',
              paddingBottom: '8px',
              fontFamily: 'Courier New, monospace',
            }}
          >
            Latest Updates:
          </h2>

          <ul 
            className="modules-list"
            style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              fontFamily: 'Courier New, monospace',
            }}
          >
            <li style={{ marginBottom: '12px', borderLeft: '4px solid #00aaaa', paddingLeft: '12px', fontFamily: 'Courier New, monospace' }}>
              <div style={{ fontWeight: 'bold', color: '#0000aa', fontFamily: 'Courier New, monospace', paddingRight: '12px' }}>APRIL 3, 2024</div>
              <div style={{ fontFamily: 'Courier New, monospace' }}>
                <span style={{ fontWeight: 'bold' }}>Released AI Yield Finder:</span>{' '}
                <Link 
                  href={process.env.NODE_ENV === 'production' ? 'https://y.hyprsqrl.com' : 'http://localhost:3060'} 
                  style={{
                    color: '#00aaaa',
                    textDecoration: 'none',
                    fontFamily: 'Courier New, monospace',
                  }}
                  className="module-link"
                >
                  AI chat instantly finds your best yield opportunities
                </Link>
              </div>
            </li>
            <li style={{ marginBottom: '12px', borderLeft: '4px solid #00aaaa', paddingLeft: '12px', fontFamily: 'Courier New, monospace' }}>
              <div style={{ fontWeight: 'bold', color: '#0000aa', fontFamily: 'Courier New, monospace', paddingRight: '12px' }}>MARCH 15, 2024</div>
              <div style={{ fontFamily: 'Courier New, monospace' }}>
                <span style={{ fontWeight: 'bold' }}>Released Crypto Invoicing:</span>{' '}
                <Link 
                  href={process.env.NODE_ENV === 'production' ? 'https://i.hyprsqrl.com' : 'http://localhost:3050'} 
                  style={{
                    color: '#00aaaa',
                    textDecoration: 'none',
                    fontFamily: 'Courier New, monospace',
                  }}
                  className="module-link"
                >
                  Easily send invoices and receive payments in crypto
                </Link>
              </div>
            </li>
            <li style={{ marginBottom: '0', borderLeft: '4px solid #777777', paddingLeft: '12px', color: '#777777', fontFamily: 'Courier New, monospace' }}>
              <div style={{ fontWeight: 'bold', fontFamily: 'Courier New, monospace' }}>ARCHIVED</div>
              <div style={{ fontFamily: 'Courier New, monospace' }}>
                <span style={{ fontWeight: 'bold', textDecoration: 'line-through' }}>
                  Screen Monitoring App:
                </span>{' '}
                <span>
                  (Discontinued) Electron app that generated invoices from your screen
                </span>
              </div>
            </li>
          </ul>
        </div>

        {children}
      </div>
    </div>
  );
}

export default BiosContainer; 