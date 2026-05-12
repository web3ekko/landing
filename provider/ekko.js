;(function () {
  const currentScript = document.currentScript
  const workspaceKey = currentScript && currentScript.getAttribute('data-workspace-key')
  const apiBase = (currentScript && currentScript.getAttribute('data-api-base')) || ''
  const adapterMode = (currentScript && currentScript.getAttribute('data-adapter-mode')) || 'manual_identify'
  const mountSelector = currentScript && currentScript.getAttribute('data-mount')
  const widgetPlacement = (currentScript && currentScript.getAttribute('data-widget-placement')) || 'append'
  const widgetState = {
    unread: 0,
    messages: [],
    identified: false,
    activeWallet: '',
    socket: null,
    widget: null,
    button: null,
    badge: null,
    dropdown: null,
    list: null,
    showZeroCount: currentScript && currentScript.getAttribute('data-show-zero-count') === 'true',
  }

  function postEvent(type, detail) {
    window.dispatchEvent(new CustomEvent(`ekko:${type}`, { detail }))
  }

  function mountTarget() {
    if (!mountSelector) return document.body
    return document.querySelector(mountSelector) || document.body
  }

  function shortWallet(walletKey) {
    const raw = String(walletKey || '')
    const address = raw.split(':').pop() || raw
    if (address.length <= 12) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  function severityLabel(severity) {
    const value = String(severity || 'info')
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1).toLowerCase()}`
  }

  function severityTone(severity) {
    const value = String(severity || 'info').toLowerCase()
    if (value === 'critical' || value === 'error') return { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
    if (value === 'success') return { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' }
    if (value === 'warning') return { color: '#b45309', bg: '#fffbeb', border: '#fed7aa' }
    return { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' }
  }

  function formatRelativeTime(value) {
    const timestamp = new Date(value).getTime()
    if (!Number.isFinite(timestamp)) return ''
    const deltaSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))
    if (deltaSeconds < 60) return 'now'
    const deltaMinutes = Math.floor(deltaSeconds / 60)
    if (deltaMinutes < 60) return `${deltaMinutes}m ago`
    const deltaHours = Math.floor(deltaMinutes / 60)
    if (deltaHours < 24) return `${deltaHours}h ago`
    return `${Math.floor(deltaHours / 24)}d ago`
  }

  function normalizeMessage(data) {
    const source = data.notification || data.payload || data
    const copy = source.copy || data.copy || {}
    const title = source.title || copy.headline || source.alert_name || source.message || 'New notification'
    const body = source.body || copy.body || copy.short_body || source.details || ''
    return {
      id: source.id || source.notification_id || data.notification_id || `ekko-${Date.now()}-${widgetState.messages.length}`,
      title,
      body,
      severity: source.severity || source.priority || data.priority || 'info',
      ctaLabel: source.cta_label || source.action_label || 'Open',
      ctaUrl: source.cta_url || source.action_url || source.actionUrl || '',
      createdAt: source.created_at || source.timestamp || data.timestamp || new Date().toISOString(),
      read: false,
    }
  }

  function setStyles(element, styles) {
    for (const key of Object.keys(styles)) {
      element.style[key] = styles[key]
    }
  }

  function syncWidgetVisibility() {
    if (!widgetState.widget) return
    const hasVisibleState = widgetState.showZeroCount || widgetState.identified
    widgetState.widget.style.display = hasVisibleState ? 'inline-block' : 'none'
    widgetState.widget.setAttribute('data-state', widgetState.identified ? 'connected' : 'not_identified')
  }

  function updateBadge() {
    if (!widgetState.badge) return
    widgetState.badge.textContent = String(widgetState.unread)
    widgetState.badge.style.display = widgetState.unread > 0 || widgetState.showZeroCount ? 'inline-flex' : 'none'
    syncWidgetVisibility()
  }

  function createText(tag, text, styles) {
    const element = document.createElement(tag)
    element.textContent = text
    if (styles) setStyles(element, styles)
    return element
  }

  function renderMessages() {
    if (!widgetState.list) return
    widgetState.list.textContent = ''

    if (widgetState.messages.length === 0) {
      const empty = createText('div', 'No wallet notifications yet', {
        color: '#667085',
        fontSize: '13px',
        padding: '18px 16px',
      })
      widgetState.list.appendChild(empty)
      return
    }

    const orderedMessages = widgetState.messages
      .slice()
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())

    for (const message of orderedMessages.slice(0, 5)) {
      const tone = severityTone(message.severity)
      const row = document.createElement('div')
      row.setAttribute('data-ekko-notification-row', '')
      setStyles(row, {
        display: 'grid',
        gridTemplateColumns: '44px minmax(0, 1fr) auto',
        gap: '12px',
        padding: '14px 16px',
        borderTop: '1px solid #eaecf0',
        alignItems: 'start',
      })

      const icon = createText('div', message.severity === 'success' ? '✓' : message.severity === 'critical' ? '!' : 'i', {
        alignItems: 'center',
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        borderRadius: '7px',
        color: tone.color,
        display: 'flex',
        fontSize: '20px',
        fontWeight: '700',
        height: '42px',
        justifyContent: 'center',
        width: '42px',
      })

      const copy = document.createElement('div')
      const titleLine = document.createElement('div')
      setStyles(titleLine, {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '5px',
      })

      const severity = createText('span', severityLabel(message.severity), {
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        borderRadius: '5px',
        color: tone.color,
        fontSize: '12px',
        lineHeight: '18px',
        padding: '1px 6px',
      })
      const title = createText('strong', message.title, {
        color: '#101828',
        fontSize: '14px',
        fontWeight: '700',
        lineHeight: '20px',
      })
      titleLine.appendChild(severity)
      titleLine.appendChild(title)
      copy.appendChild(titleLine)

      if (message.body) {
        copy.appendChild(
          createText('div', message.body, {
            color: '#475467',
            fontSize: '13px',
            lineHeight: '19px',
            maxWidth: '300px',
          }),
        )
      }

      if (message.ctaUrl) {
        const cta = document.createElement('a')
        cta.href = message.ctaUrl
        cta.textContent = message.ctaLabel
        setStyles(cta, {
          border: '1px solid #7c3aed',
          borderRadius: '5px',
          color: '#4f46e5',
          display: 'inline-flex',
          fontSize: '12px',
          lineHeight: '18px',
          marginTop: '8px',
          padding: '4px 10px',
          textDecoration: 'none',
        })
        copy.appendChild(cta)
      }

      const meta = document.createElement('div')
      setStyles(meta, {
        alignItems: 'center',
        color: '#667085',
        display: 'flex',
        fontSize: '12px',
        gap: '10px',
        whiteSpace: 'nowrap',
      })
      meta.appendChild(createText('span', formatRelativeTime(message.createdAt), null))
      meta.appendChild(
        createText('span', '', {
          background: message.read ? '#d0d5dd' : '#4f46e5',
          borderRadius: '999px',
          display: 'inline-block',
          height: '7px',
          width: '7px',
        }),
      )

      row.appendChild(icon)
      row.appendChild(copy)
      row.appendChild(meta)
      widgetState.list.appendChild(row)
    }
  }

  function markAllRead() {
    widgetState.messages = widgetState.messages.map((message) => ({ ...message, read: true }))
    widgetState.unread = 0
    renderMessages()
    updateBadge()
  }

  function renderWidget() {
    const existing = document.querySelector('[data-ekko-provider-widget]')
    if (existing) existing.remove()

    const widget = document.createElement('div')
    widget.setAttribute('data-ekko-provider-widget', '')
    setStyles(widget, {
      display: 'none',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      position: 'relative',
    })

    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('data-ekko-provider-bell', '')
    button.setAttribute('aria-label', 'Open wallet notifications')
    setStyles(button, {
      alignItems: 'center',
      background: '#ffffff',
      border: '1px solid #d0d5dd',
      borderRadius: '9px',
      boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
      color: '#101828',
      cursor: 'pointer',
      display: 'inline-flex',
      fontSize: '16px',
      height: '40px',
      justifyContent: 'center',
      minWidth: '40px',
      padding: '0 10px',
      position: 'relative',
    })
    button.appendChild(document.createTextNode('🔔'))

    const badge = document.createElement('span')
    badge.setAttribute('aria-label', 'Unread messages')
    setStyles(badge, {
      alignItems: 'center',
      background: '#4f46e5',
      border: '1px solid #ffffff',
      borderRadius: '999px',
      color: '#ffffff',
      display: 'none',
      fontSize: '11px',
      fontWeight: '700',
      height: '18px',
      justifyContent: 'center',
      minWidth: '18px',
      padding: '0 5px',
      position: 'absolute',
      right: '-7px',
      top: '-8px',
    })
    button.appendChild(badge)

    const dropdown = document.createElement('div')
    dropdown.hidden = true
    dropdown.setAttribute('data-ekko-provider-dropdown', '')
    setStyles(dropdown, {
      background: '#ffffff',
      border: '1px solid #d0d5dd',
      borderRadius: '10px',
      boxShadow: '0 18px 48px rgba(16, 24, 40, 0.16)',
      marginTop: '8px',
      minWidth: '420px',
      overflow: 'hidden',
      position: 'absolute',
      right: '0',
      zIndex: '2147483647',
    })

    const header = document.createElement('div')
    setStyles(header, {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '18px 20px 14px',
    })
    const heading = document.createElement('div')
    heading.appendChild(
      createText('div', 'Notifications', {
        color: '#101828',
        fontSize: '18px',
        fontWeight: '700',
        lineHeight: '24px',
      }),
    )
    heading.appendChild(
      createText('div', `For ${shortWallet(widgetState.activeWallet) || 'connected wallet'}`, {
        color: '#667085',
        fontSize: '13px',
        lineHeight: '18px',
      }),
    )

    const controls = document.createElement('div')
    setStyles(controls, {
      display: 'flex',
      gap: '8px',
    })
    const sound = createText('button', 'Sound', {
      background: '#ffffff',
      border: '1px solid #d0d5dd',
      borderRadius: '8px',
      color: '#344054',
      cursor: 'pointer',
      fontSize: '12px',
      height: '34px',
      padding: '0 10px',
    })
    sound.type = 'button'
    const markRead = createText('button', 'Read', {
      background: '#ffffff',
      border: '1px solid #d0d5dd',
      borderRadius: '8px',
      color: '#344054',
      cursor: 'pointer',
      fontSize: '12px',
      height: '34px',
      padding: '0 10px',
    })
    markRead.type = 'button'
    markRead.setAttribute('data-ekko-mark-all-read', '')
    markRead.addEventListener('click', markAllRead)
    controls.appendChild(sound)
    controls.appendChild(markRead)
    header.appendChild(heading)
    header.appendChild(controls)

    const list = document.createElement('div')
    const footer = document.createElement('div')
    setStyles(footer, {
      alignItems: 'center',
      borderTop: '1px solid #eaecf0',
      color: '#344054',
      display: 'flex',
      fontSize: '12px',
      gap: '8px',
      padding: '13px 20px',
    })
    footer.appendChild(createText('span', 'E', {
      alignItems: 'center',
      background: '#4f46e5',
      borderRadius: '999px',
      color: '#ffffff',
      display: 'inline-flex',
      fontSize: '11px',
      fontWeight: '800',
      height: '20px',
      justifyContent: 'center',
      width: '20px',
    }))
    footer.appendChild(createText('span', 'Notifications powered by Ekko for this connected wallet.', null))

    button.addEventListener('click', function () {
      dropdown.hidden = !dropdown.hidden
    })

    dropdown.appendChild(header)
    dropdown.appendChild(list)
    dropdown.appendChild(footer)
    widget.appendChild(button)
    widget.appendChild(dropdown)
    const target = mountTarget()
    if (widgetPlacement === 'selector' && target.firstChild) {
      target.insertBefore(widget, target.firstChild)
    } else {
      target.appendChild(widget)
    }
    widgetState.widget = widget
    widgetState.button = button
    widgetState.badge = badge
    widgetState.dropdown = dropdown
    widgetState.list = list
    renderMessages()
    updateBadge()
    syncWidgetVisibility()
  }

  function parseChainId(chainId) {
    if (typeof chainId === 'number' && Number.isFinite(chainId)) return chainId
    if (typeof chainId === 'string' && chainId.startsWith('0x')) {
      const parsed = Number.parseInt(chainId, 16)
      return Number.isFinite(parsed) ? parsed : 1
    }
    if (typeof chainId === 'string') {
      const parsed = Number.parseInt(chainId, 10)
      return Number.isFinite(parsed) ? parsed : 1
    }
    return 1
  }

  let cachedChainId = parseChainId(window.ethereum && window.ethereum.chainId)

  function normalizeWallet(address, chainId) {
    return `eip155:${chainId}:${String(address).toLowerCase()}`
  }

  function primaryWallet(payload) {
    if (!payload || !Array.isArray(payload.wallets) || payload.wallets.length === 0) return ''
    return String(payload.wallets[0])
  }

  async function identifyAccounts(accounts) {
    if (!Array.isArray(accounts) || accounts.length === 0) return null
    return identify({ wallets: accounts.map((account) => normalizeWallet(account, cachedChainId)) })
  }

  function recordMessage(data) {
    widgetState.messages.push(normalizeMessage(data))
    widgetState.unread += 1
    renderMessages()
    updateBadge()
    syncWidgetVisibility()
  }

  async function identify(payload) {
    if (!workspaceKey) {
      throw new Error('Ekko provider tag missing data-workspace-key')
    }

    const nextWallet = primaryWallet(payload)
    if (nextWallet && nextWallet !== widgetState.activeWallet) {
      widgetState.activeWallet = nextWallet
      widgetState.messages = []
      widgetState.unread = 0
    }

    const response = await fetch(`${apiBase}/api/v1/provider-audience/sdk/${workspaceKey}/identify/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.detail || 'Ekko provider identify failed')
    }

    const session = await response.json()
    if (widgetState.socket && typeof widgetState.socket.close === 'function') {
      widgetState.socket.close()
    }
    const socket = new WebSocket(session.realtime_url)
    widgetState.socket = socket
    widgetState.identified = true
    renderWidget()
    socket.addEventListener('open', function () {
      socket.send(JSON.stringify({ type: 'authenticate_provider', session_token: session.session_token }))
    })
    socket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data)
      recordMessage(data)
      postEvent('message', data)
    })
    socket.addEventListener('close', function () {
      if (widgetState.socket !== socket) return
      if (widgetState.widget) {
        widgetState.widget.setAttribute('data-state', 'reconnecting')
      }
      postEvent('disconnect', { session_id: session.session_id })
    })
    postEvent('connect', { session_id: session.session_id })
    return { ...session, socket }
  }

  async function detectAuthorizedAccounts() {
    const ethereum = window.ethereum
    if (!ethereum || typeof ethereum.request !== 'function') return
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      await identifyAccounts(accounts)
    } catch (error) {
      postEvent('adapter-error', { message: error && error.message ? error.message : 'EIP-1193 detection failed' })
    }
  }

  function listenForWalletChanges() {
    const ethereum = window.ethereum
    if (!ethereum || typeof ethereum.on !== 'function') return
    ethereum.on('accountsChanged', function (accounts) {
      identifyAccounts(accounts).catch(function (error) {
        postEvent('adapter-error', { message: error && error.message ? error.message : 'Account refresh failed' })
      })
    })
    ethereum.on('chainChanged', function (chainId) {
      cachedChainId = parseChainId(chainId)
      detectAuthorizedAccounts()
    })
  }

  renderWidget()
  listenForWalletChanges()
  if (adapterMode === 'eip1193_auto') {
    detectAuthorizedAccounts()
  }

  window.EkkoProviderMessaging = {
    identify,
  }
})()
