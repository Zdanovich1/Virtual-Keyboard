const Keyboard = {
   elements: {
      main: null,
      keysContainer: null,
      keys: [],
   },

   eventHandlers: {
      oninput: null,
      onclose: null,
   },

   properties: {
      value: '',
      capsLock: false,
   },

   init() {
       // Create main elements
      this.elements.main = document.createElement('div');
      this.elements.keysContainer = document.createElement('div');

       // Setup main elements
      this.elements.main.classList.add('keyboard', 'keyboard--hidden');
      this.elements.keysContainer.classList.add('keyboard__keys');
      this.elements.keysContainer.appendChild(this.createKeys());

      this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

       // Add to DOM
      this.elements.main.appendChild(this.elements.keysContainer);
      document.body.appendChild(this.elements.main);

       // Automatically use keyboard for elements with .use-keyboard-input
      document.querySelectorAll('.use-keyboard-input').forEach((element) => {
         element.addEventListener('focus', () => {
               this.open(element.value, (currentValue) => {
                  element.value = currentValue;
               });
         });
      });
   },

   createKeys() {
      const fragment = document.createDocumentFragment();
      const keyLayout = [
         '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
         'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'del',
         'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
         'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'arrow-up', 'shift',
         'space', 'arrow-left', 'arrow-down', 'arrow-right',
      ];

       // Creates HTML for an icon
      const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

      keyLayout.forEach((key) => {
         const keyElement = document.createElement('button');
         const insertLineBreak = ['backspace', 'del', 'enter', 'shift'].indexOf(key) !== -1;

           // Add attributes/classes
         keyElement.setAttribute('type', 'button');
         keyElement.classList.add('keyboard__key');

         switch (key) {
            case 'arrow-up':
               // keyElement.classList.add('keyboard__key--wide');
               keyElement.innerHTML = createIconHTML('arrow_upward');

               break;

               case 'arrow-left':
                  // keyElement.classList.add('keyboard__key--wide');
                  keyElement.innerHTML = createIconHTML('arrow_back');

                  break;

                  case 'arrow-down':
                     // keyElement.classList.add('keyboard__key--wide');
                     keyElement.innerHTML = createIconHTML('arrow_downward');

                     break;

                     case 'arrow-right':
                        // keyElement.classList.add('keyboard__key--wide');
                        keyElement.innerHTML = createIconHTML('arrow_forward');

                        break;

               case 'backspace':
                  keyElement.classList.add('keyboard__key--wide');
                  keyElement.innerHTML = createIconHTML('backspace');

                  keyElement.addEventListener('click', () => {
                     this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                     this.triggerEvent('oninput');
                  });

                  break;

                  case 'del':
                     keyElement.classList.add('keyboard__key--wide');
                     keyElement.innerHTML = 'del';

                     keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this.triggerEvent('oninput');
                     });

                     break;

               case 'caps':
                  keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                  keyElement.innerHTML = createIconHTML('keyboard_capslock');

                  keyElement.addEventListener('click', () => {
                     this.toggleCapsLock();
                     keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                  });

                  break;

                  case 'shift':
                     keyElement.classList.add('keyboard__key--wide');
                     keyElement.innerHTML = 'shift';

                     keyElement.addEventListener('mousedown', () => {
                        this.toggleCapsLock();
                     });

                     keyElement.addEventListener('mouseup', () => {
                        this.toggleCapsLock();
                     });

                     break;

               case 'enter':
                  keyElement.classList.add('keyboard__key--wide');
                  keyElement.innerHTML = createIconHTML('keyboard_return');

                  keyElement.addEventListener('click', () => {
                     this.properties.value += '\n';
                     this.triggerEvent('oninput');
                  });

                  break;

               case 'space':
                  keyElement.classList.add('keyboard__key--extra-wide');
                  keyElement.innerHTML = createIconHTML('space_bar');

                  keyElement.addEventListener('click', () => {
                     this.properties.value += ' ';
                     this.triggerEvent('oninput');
                  });

                  break;

                  case 'tab':
                     keyElement.innerHTML = createIconHTML('keyboard_tab');

                     keyElement.addEventListener('click', () => {
                        this.properties.value += '    ';
                        this.triggerEvent('oninput');
                     });

                     break;

               case 'done':
                  keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
                  keyElement.innerHTML = createIconHTML('check_circle');

                  keyElement.addEventListener('click', () => {
                     this.close();
                     this.triggerEvent('onclose');
                  });

                  break;

               default:
                  keyElement.textContent = key.toLowerCase();

                  keyElement.addEventListener('click', () => {
                     this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                     this.triggerEvent('oninput');
                  });

                  break;
         }

         fragment.appendChild(keyElement);

         if (insertLineBreak) {
               fragment.appendChild(document.createElement('br'));
         }
      });

      return fragment;
   },

   triggerEvent(handlerName) {
      if (typeof this.eventHandlers[handlerName] === 'function') {
         this.eventHandlers[handlerName](this.properties.value);
      }
   },

   toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;

      for (const key of this.elements.keys) {
         if (key.childElementCount === 0) {
               key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
         }
      }
   },

   open(initialValue, oninput, onclose) {
      this.properties.value = initialValue || '';
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.remove('keyboard--hidden');
   },

   close() {
      this.properties.value = '';
      this.eventHandlers.oninput = oninput;
      this.eventHandlers.onclose = onclose;
      this.elements.main.classList.add('keyboard--hidden');
   },
};

window.addEventListener('DOMContentLoaded', () => {
   Keyboard.init();
});

function initContent() {
   const body = document.querySelector('body');
   const content = `<div class="wrapper">
                           <h1 style="text-align: center;">Virtual Keyboard</h1>
                           <div class="addition" style="text-align: center;">
                           <p data-i18n="system">Keyboard created in Windows system</p>
                           <p data-i18n="changing">For changing language: ctrl + alt (еще не реализовано)</p>
                     </div>
                           <textarea class="use-keyboard-input" style="display: block; margin: 10px auto; width: 50%; max-width: 900px; height: 20vh;"></textarea>
                     </div>`;

   body.insertAdjacentHTML('afterbegin', content);
}

initContent();
