'use strict'

const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Log'
const COLLECTION_NAME = 'logs'
const logSchema = new mongoose.Schema(
  {
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'READ', 'OTHER'],
    },
    entity: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    before: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    after: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    content: {
        type: String,
        default: null,
    } 
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 }); // 1 day

module.exports = mongoose.model(DOCUMENT_NAME, logSchema)