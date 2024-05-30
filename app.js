'use strict';

const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { KoaAdapter } = require('@bull-board/koa');
const { Queue: QueueMQ } = require('bullmq');
const path = require('path');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  async serverDidReady() {
    const connection = {
      port: 6379,
      password: '',
    };

    const queues = [ new BullMQAdapter(new QueueMQ('test', { connection })) ];

    const serverAdapter = new KoaAdapter();
    serverAdapter.setBasePath('/bull-board');

    createBullBoard({ queues, serverAdapter });

    await this.app.use(serverAdapter.registerPlugin());
  }
}

module.exports = AppBootHook;
