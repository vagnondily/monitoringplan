
// Service Worker for Monitoring & Evaluation Management System
// Version: 1.0.0

const CACHE_NAME = 'monitoring-evaluation-cache-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// Fetch event - respond with cache first, then network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip requests to API endpoints
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Make network request
        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // You can return a custom offline page here
            // return caches.match('/offline.html');
          });
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Function to sync data with server
async function syncData() {
  try {
    // Get all pending actions from IndexedDB
    const pendingActions = await getPendingActions();
    
    // Process each action
    for (const action of pendingActions) {
      await sendToServer(action);
      await markActionComplete(action.id);
    }
    
    return true;
  } catch (error) {
    console.error('Background sync failed:', error);
    return false;
  }
}

// Mock functions for demonstration
async function getPendingActions() {
  // In a real app, this would fetch from IndexedDB
  return [];
}

async function sendToServer(action) {
  // In a real app, this would send data to the server
  console.log('Sending to server:', action);
  return true;
}

async function markActionComplete(id) {
  // In a real app, this would update IndexedDB
  console.log('Marked action complete:', id);
  return true;
}

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const notification = event.data.json();
  const options = {
    body: notification.body,
    icon: notification.icon || '/icons/icon-192x192.png',
    badge: notification.badge || '/icons/badge-72x72.png',
    data: notification.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(notification.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        const matchingClient = windowClients.find(
          (client) => client.url === urlToOpen && 'focus' in client
        );
        
        if (matchingClient) {
          return matchingClient.focus();
        }
        
        return clients.openWindow(urlToOpen);
      })
  );
});
