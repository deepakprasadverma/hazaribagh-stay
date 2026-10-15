// Hazaribagh Mitra - AI Rental & Accommodation Assistant

const Chatbot = {
  isOpen: false,
  messages: [],

  init() {
    this.messages = [
      {
        sender: 'bot',
        text: `🙏 <b>Namaste! Main Addix Stay Assistant hoon.</b><br>Main aapko Hazaribagh me best <b>Student Hostel, Lodge, Family Flat, Hotel</b> ya <b>Shop for Rent</b> dhundhne me turant madad kar sakta hoon.<br><br>Aap mujhse Hinglish, Hindi ya English me kuch bhi pooch sakte hain!`
      }
    ];
    this.renderMessages();
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const windowEl = document.getElementById('chatbot-window');
    const badgeEl = document.getElementById('chat-notification-dot');

    if (this.isOpen) {
      windowEl.classList.remove('hidden');
      if (badgeEl) badgeEl.classList.add('hidden');
      setTimeout(() => {
        const input = document.getElementById('chatbot-input');
        if (input) input.focus();
        this.scrollToBottom();
      }, 100);
    } else {
      windowEl.classList.add('hidden');
    }
  },

  renderMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    container.innerHTML = this.messages.map(m => {
      if (m.sender === 'user') {
        return `
          <div class="flex justify-end mb-3">
            <div class="chat-bubble-user max-w-[85%] px-4 py-2.5 rounded-2xl text-xs md:text-sm shadow-sm text-white">
              ${m.text}
            </div>
          </div>
        `;
      } else {
        return `
          <div class="flex items-start gap-2 mb-3">
            <div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 shadow">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="chat-bubble-bot max-w-[85%] px-4 py-2.5 rounded-2xl text-xs md:text-sm border border-slate-200 shadow-sm text-slate-800">
              ${m.text}
              ${m.cardsHtml ? `<div class="mt-2 space-y-2">${m.cardsHtml}</div>` : ''}
            </div>
          </div>
        `;
      }
    }).join('');

    this.scrollToBottom();
  },

  scrollToBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },

  async sendQuery(customText = null) {
    const input = document.getElementById('chatbot-input');
    const query = customText || (input ? input.value.trim() : '');
    if (!query) return;

    if (input) input.value = '';

    // Add user message
    this.messages.push({ sender: 'user', text: query });
    this.renderMessages();

    // Show typing indicator
    const typingMsg = { sender: 'bot', text: '<span class="italic text-slate-500"><i class="fa-solid fa-spinner fa-spin"></i> Hazaribagh Mitra khoj raha hai...</span>' };
    this.messages.push(typingMsg);
    this.renderMessages();

    try {
      const response = await API.sendChatMessage(query);
      // Remove typing indicator
      this.messages.pop();

      let cardsHtml = '';
      if (response.properties && response.properties.length > 0) {
        cardsHtml = response.properties.map(p => {
          return `
            <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex gap-2.5 items-center">
              <img src="${p.images[0]}" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" alt="${p.title}">
              <div class="flex-1 min-w-0">
                <p class="font-bold text-slate-900 text-xs truncate">${p.title}</p>
                <p class="text-[11px] text-slate-500"><i class="fa-solid fa-location-dot text-red-500"></i> ${p.locality} • ₹${p.price}/${p.pricePeriod}</p>
                <div class="flex gap-2 mt-1">
                  <a href="https://wa.me/${p.ownerWhatsapp}" target="_blank" class="text-[10px] bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <i class="fa-brands fa-whatsapp"></i> Chat
                  </a>
                  <button onclick="App.openPropertyDetailModal('${p.id}'); Chatbot.toggle();" class="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded font-semibold">
                    View
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }

      this.messages.push({
        sender: 'bot',
        text: response.reply,
        cardsHtml
      });
      this.renderMessages();
    } catch (err) {
      console.error(err);
      this.messages.pop();
      this.messages.push({
        sender: 'bot',
        text: 'Maaf karein, network error aayi. Kripya thodi der baad prayas karein ya helpline WhatsApp par sampark karein.'
      });
      this.renderMessages();
    }
  },

  sendQuickChip(text) {
    if (!this.isOpen) this.toggle();
    this.sendQuery(text);
  }
};
