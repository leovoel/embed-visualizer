// for colors, 24-bit integer expected to be in RR GG BB order
const UINT24_MAX = Math.pow(2, 24) - 1;

// iso 8601, but no support for utc offsets
// or even +00:00 for that matter, either just Z or nothing
const ISO_8601 = /^(\d{4})-(\d\d)-(\d\d)([T ](\d\d):(\d\d):(\d\d)(\.\d+)?(Z)?)?$/;


// see https://discordapp.com/developers/docs/resources/channel#embed-object

// we don't check urls here, even though generally only http(s) urls work
// although there's the special attachment:// ones for uploads
// (see https://discordapp.com/developers/docs/resources/channel#using-attachments-within-embeds)

// this depends on the custom 'disallowed' and 'atLeastOneOf' keywords
// (see validation.js)

// NOTE: when disallowing properties, we have to include them as
// valid properties first. kinda stupid, but i can't think of other ways
// to prevent ajv from overriding the disallowed property error. yet, anyway.

const embedSchema = {
  "type": "object",
  "additionalProperties": false,
  "disallowed": ["type", "provider", "video"],
  "properties": {
    "title": { "type": "string", "maxLength": 256 },
    "url": { "type": "string" },
    "description": { "type": "string", "maxLength": 2048 },
    "timestamp": { "type": "string", "pattern": ISO_8601.source },
    "color": { "type": "integer", "maximum": UINT24_MAX },
    "footer": {
      "type": "object",
      "additionalProperties": false,
      "disallowed": ["proxy_icon_url"],
      "properties": {
        "text": { "type": "string", "maxLength": 2048 },
        "icon_url": { "type": "string" },
        "proxy_icon_url": {}
      }
    },
    "image": {
      "type": "object",
      "additionalProperties": false,
      "disallowed": ["proxy_url", "width", "height"],
      "properties": {
        "url": { "type": "string" },
        "proxy_url": {},
        "width": {},
        "height": {}
      }
    },
    "thumbnail": {
      "type": "object",
      "additionalProperties": false,
      "disallowed": ["proxy_url", "width", "height"],
      "properties": {
        "url": { "type": "string" },
        "proxy_url": {},
        "width": {},
        "height": {}
      }
    },
    "author": {
      "type": "object",
      "additionalProperties": false,
      "disallowed": ["proxy_icon_url"],
      "properties": {
        "name": { "type": "string", "maxLength": 256 },
        "url": { "type": "string" },
        "icon_url": { "type": "string" },
        "proxy_icon_url": {}
      }
    },
    "fields": {
      "type": "array",
      "maxItems": 25,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "name": { "type": "string", "maxLength": 256 },
          "value": { "type": "string", "maxLength": 1024 },
          "inline": { "type": "boolean" }
        }
      }
    },
    "provider": {},
    "video": {},
    "type": {}
  }
};

// there's a lot of fields omitted in the bot message schema,
// and a couple in the webhook one. we are not concerned with most of them,
// our job is just to validate embeds.

const botMessageSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "content": {
      "type": "string",
      "maxLength": 2000
    },
    "embed": embedSchema
  },
  "atLeastOneOf": ["content", "embed"]
};

const webhookMessageSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "username": { "type": "string", "maxLength": 256 },
    "avatar_url": { "type": "string" },
    "content": { "type": "string", "maxLength": 2000 },
    "embeds": { "type": "array", "maxItems": 10, "items": embedSchema }
  },
  "atLeastOneOf": ["content", "embeds"]
};

export { botMessageSchema, webhookMessageSchema };
