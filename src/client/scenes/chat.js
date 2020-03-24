import {Control, InputText, ScrollViewer, StackPanel, TextBlock} from "babylonjs-gui";
import {chatSocket} from "../sockets/chat";

class Chat {
    init(advancedTexture) {
        this.advancedTexture = advancedTexture;

        this.setupGui();

        chatSocket.addListener(message => {
            this.appendMessage(message);
        });
    }

    setupGui() {
        const chatContainer = new StackPanel();
        chatContainer.isPointerBlocker = true;
        chatContainer.isVertical = true;
        chatContainer.alpha = 0.7;
        chatContainer.background = "black";
        chatContainer.adaptHeightToChildren = false;
        chatContainer.adaptWidthToChildren = false;
        chatContainer.height = "220px";
        chatContainer.width = "200px";
        chatContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        chatContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.advancedTexture.addControl(chatContainer);

        this.chatScroll = new ScrollViewer();
        this.chatScroll.width = "200px";
        this.chatScroll.height = "200px";
        chatContainer.addControl(this.chatScroll);

        this.chatText = new TextBlock();
        this.chatText.text = "";
        this.chatText.color = "white";
        this.chatText.fontSize = 12;
        this.chatText.resizeToFit = true;
        this.chatText.textWrapping = true;
        this.chatText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.chatScroll.addControl(this.chatText);

        const chatInput = new InputText();
        chatInput.width = "200px";
        chatInput.height = "20px";
        chatInput.color = "white";
        chatInput.fontSize = 12;
        chatInput.onKeyboardEventProcessedObservable.add((eventData) => {
            if (eventData.key === 'Enter') {
                chatSocket.send(chatInput.text);
                chatInput.text = '';
                this.advancedTexture.moveFocusToControl(chatInput);
            }
        });
        chatContainer.addControl(chatInput);
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatScroll.verticalBar.value = 0;
            this.chatScroll.verticalBar.value = 1;
        }, 100);
    }

    appendMessage(text) {
        this.chatText.text += text;
        this.scrollToBottom();
    }
}

export const chat = new Chat();
