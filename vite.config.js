import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home.html'),
        register: resolve(__dirname, 'register.html'),
        booking: resolve(__dirname, 'booking.html'),
        preview: resolve(__dirname, 'preview.html'),
        payment: resolve(__dirname, 'payment.html'),
      }
    }
  }
});
