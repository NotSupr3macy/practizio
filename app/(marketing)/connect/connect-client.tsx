'use client'

import { useState } from 'react'
import Image from 'next/image'

const MCP_URL = 'https://spadechat.com/api/mcp'

const MAC_SCRIPT = `#!/bin/bash
# Downloads and runs the SpadeChat installer for Claude Desktop (macOS)
curl -fsSL https://spadechat.com/install/mac.sh | bash`

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="font-mono text-[11px] uppercase transition-all duration-300 shrink-0"
      style={{
        letterSpacing: '0.2em',
        padding: '10px 20px',
        borderRadius: '2px',
        border: '1px solid rgba(255,255,255,0.15)',
        color: copied ? 'var(--white)' : 'rgba(255,255,255,0.5)',
        background: copied ? 'rgba(255,255,255,0.1)' : 'transparent',
      }}
    >
      {copied ? 'COPIED' : label || 'COPY'}
    </button>
  )
}

function ExpandableSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="font-mono text-[12px] uppercase flex items-center gap-2 transition-all duration-300"
        style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}
      >
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          &#9654;
        </span>
        {title}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}

export default function ConnectClient() {
  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="py-24 md:py-32 px-6 md:px-10" style={{ background: 'var(--navy)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <span
            className="font-mono text-[11px] uppercase block mb-6"
            style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}
          >
            GET CONNECTED
          </span>
          <h1
            className="editorial-heading mb-6"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: 'var(--white)', lineHeight: 1.1 }}
          >
            Connect SpadeChat{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>
              to Your AI
            </span>
          </h1>
          <p
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 300,
              fontSize: '20px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            Find and book local businesses through any AI assistant. Set up in under 30 seconds.
          </p>
        </div>
      </section>

      {/* Two columns: Claude + ChatGPT */}
      <section className="px-6 md:px-10 py-20 md:py-28" style={{ background: 'var(--navy)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Claude Desktop */}
          <div
            className="p-8 md:p-12 flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Logo */}
            <div className="w-14 h-14 mb-6 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
              <Image src="/ai-logos/claude.png" alt="Claude" width={36} height={36} className="object-contain" />
            </div>

            <span
              className="font-mono text-[11px] uppercase block mb-2"
              style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}
            >
              RECOMMENDED
            </span>

            <h2
              className="font-display uppercase mb-4"
              style={{ fontSize: '32px', color: 'var(--white)' }}
            >
              CLAUDE DESKTOP
            </h2>

            <p
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '17px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              One-click install — we&apos;ll configure everything automatically.
            </p>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="/install/mac.sh"
                download="install-spadechat-mac.sh"
                className="font-mono text-[11px] uppercase text-center transition-all duration-300 flex-1"
                style={{
                  letterSpacing: '0.2em',
                  padding: '16px 20px',
                  borderRadius: '2px',
                  background: 'var(--white)',
                  color: 'var(--navy)',
                  fontWeight: 700,
                }}
              >
                DOWNLOAD FOR MAC
              </a>
              <a
                href="/install/windows.bat"
                download="install-spadechat-windows.bat"
                className="font-mono text-[11px] uppercase text-center transition-all duration-300 flex-1"
                style={{
                  letterSpacing: '0.2em',
                  padding: '16px 20px',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--white)',
                }}
              >
                DOWNLOAD FOR WINDOWS
              </a>
            </div>

            {/* Terminal one-liner for Mac */}
            <div className="mb-8">
              <span
                className="font-mono text-[11px] uppercase block mb-3"
                style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}
              >
                OR PASTE THIS INTO TERMINAL (MAC):
              </span>
              <div
                className="flex items-center justify-between gap-3 p-4"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <code
                  className="font-mono text-[13px] break-all"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  curl -fsSL https://spadechat.com/install/mac.sh | bash
                </code>
                <CopyButton text={MAC_SCRIPT} />
              </div>
            </div>

            {/* Platform notes */}
            <div
              className="p-5 mb-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '2px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="font-mono text-[11px] uppercase mb-2"
                style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)' }}
              >
                AFTER INSTALLING:
              </p>
              <p
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 300,
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.7,
                }}
              >
                Restart Claude Desktop. Then try asking: &quot;Find me a haircut near Eugene, Oregon&quot;
              </p>
            </div>

            {/* Windows note */}
            <p
              className="font-mono text-[11px] mb-4"
              style={{ letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', lineHeight: 1.7 }}
            >
              WINDOWS: After downloading, double-click the file to run it. If SmartScreen appears, click &apos;More info&apos; then &apos;Run anyway&apos;.
            </p>

            {/* What does this do? */}
            <ExpandableSection title="What does this do?">
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 300,
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.7,
                }}
              >
                <p className="mb-3">
                  This script adds SpadeChat to your Claude Desktop configuration file. It does not modify any other settings. Specifically, it:
                </p>
                <ol className="space-y-2 ml-4" style={{ listStyleType: 'decimal' }}>
                  <li>Finds your Claude Desktop config file</li>
                  <li>Adds the SpadeChat directory server to your MCP connections</li>
                  <li>That&apos;s it — restart Claude Desktop and you&apos;re connected</li>
                </ol>
                <p className="mt-4" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>
                  Config file location:<br />
                  Mac: ~/Library/Application Support/Claude/claude_desktop_config.json<br />
                  Windows: %APPDATA%\Claude\claude_desktop_config.json
                </p>
              </div>
            </ExpandableSection>
          </div>

          {/* ChatGPT */}
          <div
            className="p-8 md:p-12 flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Logo */}
            <div className="w-14 h-14 mb-6 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
              <Image src="/ai-logos/chatgpt.webp" alt="ChatGPT" width={36} height={36} className="object-contain" />
            </div>

            <span
              className="font-mono text-[11px] uppercase block mb-2"
              style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}
            >
              MANUAL SETUP
            </span>

            <h2
              className="font-display uppercase mb-4"
              style={{ fontSize: '32px', color: 'var(--white)' }}
            >
              CHATGPT
            </h2>

            <p
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 300,
                fontSize: '17px',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              Manual setup — takes about 60 seconds.
            </p>

            {/* Requirement note */}
            <div
              className="p-4 mb-8"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '2px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="font-mono text-[11px] uppercase"
                style={{ letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}
              >
                REQUIRES CHATGPT PLUS, PRO, TEAM, ENTERPRISE, OR EDU PLAN. FREE ACCOUNTS CANNOT CONNECT MCP SERVERS.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-10 flex-1">
              {/* Step 1 */}
              <div>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.15)' }}>01</span>
                  <h3
                    className="font-mono text-[13px] uppercase"
                    style={{ letterSpacing: '0.2em', color: 'var(--white)' }}
                  >
                    OPEN SETTINGS
                  </h3>
                </div>
                <p
                  className="ml-12"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.7,
                  }}
                >
                  Go to chatgpt.com, click your profile icon in the bottom-left, and select &quot;Settings&quot;.
                </p>
              </div>

              {/* Step 2 */}
              <div>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.15)' }}>02</span>
                  <h3
                    className="font-mono text-[13px] uppercase"
                    style={{ letterSpacing: '0.2em', color: 'var(--white)' }}
                  >
                    ENABLE DEVELOPER MODE
                  </h3>
                </div>
                <p
                  className="ml-12"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.7,
                  }}
                >
                  Click &quot;Apps &amp; Connectors&quot;, then &quot;Advanced settings&quot;, and toggle on &quot;Developer Mode&quot;.
                </p>
              </div>

              {/* Step 3 */}
              <div>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.15)' }}>03</span>
                  <h3
                    className="font-mono text-[13px] uppercase"
                    style={{ letterSpacing: '0.2em', color: 'var(--white)' }}
                  >
                    CREATE A NEW CONNECTOR
                  </h3>
                </div>
                <div
                  className="ml-12"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.7,
                  }}
                >
                  <p className="mb-3">In the Apps &amp; Connectors section, click &quot;Create&quot; and fill in:</p>
                  <div
                    className="p-4 space-y-3"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '2px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                    }}
                  >
                    <p><span style={{ color: 'rgba(255,255,255,0.35)' }}>Name:</span> <span style={{ color: 'rgba(255,255,255,0.65)' }}>SpadeChat</span></p>
                    <p><span style={{ color: 'rgba(255,255,255,0.35)' }}>Description:</span> <span style={{ color: 'rgba(255,255,255,0.65)' }}>Find and book appointments at local businesses through AI.</span></p>
                    <p><span style={{ color: 'rgba(255,255,255,0.35)' }}>URL:</span> <span style={{ color: 'rgba(255,255,255,0.65)' }}>{MCP_URL}</span></p>
                  </div>
                  <p className="mt-3">Click &quot;Create&quot; to save.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.15)' }}>04</span>
                  <h3
                    className="font-mono text-[13px] uppercase"
                    style={{ letterSpacing: '0.2em', color: 'var(--white)' }}
                  >
                    USE IT IN A CONVERSATION
                  </h3>
                </div>
                <div
                  className="ml-12"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 300,
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.7,
                  }}
                >
                  <p className="mb-2">Open a new chat, click the &quot;+&quot; icon, select &quot;More&quot; then &quot;Developer mode&quot;, and toggle &quot;SpadeChat&quot; on.</p>
                  <p>Ask: &quot;Find me a haircut near Eugene, Oregon&quot;</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div
              className="mt-8 p-5 space-y-3"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '2px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="font-mono text-[11px] uppercase"
                style={{ letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}
              >
                You need to enable SpadeChat for each new conversation — it doesn&apos;t stay on automatically.
              </p>
              <p
                className="font-mono text-[11px] uppercase"
                style={{ letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}
              >
                ChatGPT will ask you to confirm before calling any tools. Click &quot;Confirm&quot; to allow it to search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other clients */}
      <section className="py-20 px-6 md:px-10" style={{ background: 'var(--navy)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <span
            className="font-mono text-[11px] uppercase block mb-4"
            style={{ letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}
          >
            USING A DIFFERENT AI CLIENT?
          </span>
          <p
            className="mb-8"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 300,
              fontSize: '18px',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.7,
            }}
          >
            Any MCP-compatible client can connect to SpadeChat. Add this URL as a custom MCP server in your client&apos;s settings:
          </p>
          <div
            className="flex items-center justify-center gap-4 p-5 mx-auto"
            style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '2px',
              border: '1px solid rgba(255,255,255,0.06)',
              maxWidth: 520,
            }}
          >
            <code
              className="font-mono text-[14px] break-all"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {MCP_URL}
            </code>
            <CopyButton text={MCP_URL} />
          </div>
        </div>
      </section>
    </div>
  )
}
