// plugins/fetchAdmin.client.js
import { useAdminStore } from '~/stores/adminStore';
import { useCookie } from '#app';

export default defineNuxtPlugin(async () => {
  if (!process.client) return;

  const adminStore = useAdminStore();
  console.log('[plugin:fetchAdmin] start');

  if (adminStore.me) {
    console.log('[plugin:fetchAdmin] already admin logged in');
    return;
  }

  const tokenCookie = useCookie('admin_token');
  if (tokenCookie.value) {
    console.log('[plugin:fetchAdmin] admin_token exists, fetching admin...');
    try {
      await adminStore.fetchMe();
      if (adminStore.me) {
        console.log('[plugin:fetchAdmin] restored admin:', adminStore.me);
      } else {
        console.warn('[plugin:fetchAdmin] token invalid or expired');
      }
    } catch (err) {
      console.error('[plugin:fetchAdmin] fetchMe error:', err);
    }
  } else {
    console.log('[plugin:fetchAdmin] no admin_token cookie, skip');
  }
});


