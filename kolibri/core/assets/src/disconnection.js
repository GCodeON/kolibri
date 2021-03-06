import { createTranslator } from 'kolibri.utils.i18n';

export const trs = createTranslator('disconnectionSnackbars', {
  disconnected: 'Disconnected from server. Will try to reconnect in { remainingTime }',
  tryNow: 'Try now',
  tryingToReconnect: 'Trying to reconnect…',
  successfullyReconnected: 'Successfully reconnected!',
});

export function createTryingToReconnectSnackbar(store) {
  store.dispatch('CORE_CREATE_SNACKBAR', {
    text: trs.$tr('tryingToReconnect'),
    backdrop: true,
  });
}

let dynamicReconnectTime = 0;
let timer = null;

export function createDisconnectedSnackbar(store, beatCallback) {
  // clear timers
  clearTimer();
  // set proper time
  setDynamicReconnectTime(store.state.core.connection.reconnectTime);
  // create snackbar
  store.dispatch('CORE_CREATE_SNACKBAR', {
    text: generateDisconnectedSnackbarText(),
    actionText: trs.$tr('tryNow'),
    actionCallback: beatCallback,
    backdrop: true,
    forceReuse: true,
  });
  // start timeout
  timer = setInterval(() => {
    setDynamicReconnectTime(dynamicReconnectTime - 1);
    store.dispatch('CORE_SET_SNACKBAR_TEXT', generateDisconnectedSnackbarText());
  }, 1000);
}

function setDynamicReconnectTime(time) {
  dynamicReconnectTime = Math.max(time, 0);
}

function generateDisconnectedSnackbarText() {
  const remainingTime = new Date(1000 * dynamicReconnectTime).toISOString().substr(14, 5);
  return trs.$tr('disconnected', { remainingTime });
}

function clearTimer() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

export function createReconnectedSnackbar(store) {
  clearTimer();
  store.dispatch('CORE_CREATE_SNACKBAR', {
    text: trs.$tr('successfullyReconnected'),
    autoDismiss: true,
  });
}
