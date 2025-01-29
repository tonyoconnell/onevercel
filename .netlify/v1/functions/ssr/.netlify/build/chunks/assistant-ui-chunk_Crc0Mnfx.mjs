import { z, ZodFirstPartyTypeKind, ZodOptional } from 'zod';
import * as React from 'react';
import React__default, { useContext, useSyncExternalStore, useDebugValue, createContext, useState, useEffect, memo, useMemo, forwardRef, useCallback, useRef } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { CheckIcon, CopyIcon, AudioLinesIcon, StopCircleIcon, RefreshCwIcon, ThumbsUpIcon, ThumbsDownIcon, ChevronLeftIcon, ChevronRightIcon, CircleXIcon, FileIcon, PaperclipIcon, SendHorizontalIcon, PencilIcon, ArrowDownIcon, BotIcon, ChevronDownIcon } from 'lucide-react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva } from 'class-variance-authority';
import 'react-dom';
import { Slot } from '@radix-ui/react-slot';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { AvatarFallback as AvatarFallback$1 } from '@radix-ui/react-avatar';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import * as PopoverPrimitive from '@radix-ui/react-popover';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

// src/runtimes/edge/streams/AssistantStreamChunkType.ts
var AssistantStreamChunkType = /* @__PURE__ */ ((AssistantStreamChunkType2) => {
  AssistantStreamChunkType2["TextDelta"] = "0";
  AssistantStreamChunkType2["Data"] = "2";
  AssistantStreamChunkType2["Error"] = "3";
  AssistantStreamChunkType2["Annotation"] = "8";
  AssistantStreamChunkType2["ToolCall"] = "9";
  AssistantStreamChunkType2["ToolCallResult"] = "a";
  AssistantStreamChunkType2["ToolCallBegin"] = "b";
  AssistantStreamChunkType2["ToolCallDelta"] = "c";
  AssistantStreamChunkType2["FinishMessage"] = "d";
  AssistantStreamChunkType2["FinishStep"] = "e";
  AssistantStreamChunkType2["StartStep"] = "f";
  AssistantStreamChunkType2["ReasoningDelta"] = "g";
  return AssistantStreamChunkType2;
})(AssistantStreamChunkType || {});

// src/runtimes/edge/streams/assistantEncoderStream.ts
function assistantEncoderStream() {
  const toolCalls = /* @__PURE__ */ new Set();
  return new TransformStream({
    transform(chunk, controller) {
      const chunkType = chunk.type;
      switch (chunkType) {
        case "text-delta": {
          if (!chunk.textDelta) break;
          controller.enqueue({
            type: AssistantStreamChunkType.TextDelta,
            value: chunk.textDelta
          });
          break;
        }
        case "tool-call-delta": {
          if (!toolCalls.has(chunk.toolCallId)) {
            toolCalls.add(chunk.toolCallId);
            controller.enqueue({
              type: AssistantStreamChunkType.ToolCallBegin,
              value: {
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName
              }
            });
          }
          controller.enqueue({
            type: AssistantStreamChunkType.ToolCallDelta,
            value: {
              toolCallId: chunk.toolCallId,
              argsTextDelta: chunk.argsTextDelta
            }
          });
          break;
        }
        case "annotations": {
          controller.enqueue({
            type: AssistantStreamChunkType.Annotation,
            value: chunk.annotations
          });
          break;
        }
        case "data": {
          controller.enqueue({
            type: AssistantStreamChunkType.Data,
            value: chunk.data
          });
          break;
        }
        // ignore
        case "tool-call":
        case "response-metadata":
          break;
        case "tool-result": {
          controller.enqueue({
            type: AssistantStreamChunkType.ToolCallResult,
            value: {
              toolCallId: chunk.toolCallId,
              result: chunk.result
            }
          });
          break;
        }
        case "step-finish": {
          const { type, ...rest } = chunk;
          controller.enqueue({
            type: AssistantStreamChunkType.FinishStep,
            value: rest
          });
          break;
        }
        case "finish": {
          const { type, ...rest } = chunk;
          controller.enqueue({
            type: AssistantStreamChunkType.FinishMessage,
            value: rest
          });
          break;
        }
        case "error": {
          controller.enqueue({
            type: AssistantStreamChunkType.Error,
            value: chunk.error
          });
          break;
        }
        default: {
          const unhandledType = chunkType;
          throw new Error(`Unhandled chunk type: ${unhandledType}`);
        }
      }
    }
  });
}

// src/model-context/ModelContextTypes.ts
var LanguageModelV1CallSettingsSchema = z.object({
  maxTokens: z.number().int().positive().optional(),
  temperature: z.number().optional(),
  topP: z.number().optional(),
  presencePenalty: z.number().optional(),
  frequencyPenalty: z.number().optional(),
  seed: z.number().int().optional(),
  headers: z.record(z.string().optional()).optional()
});
var LanguageModelConfigSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  modelName: z.string().optional()
});
var mergeModelContexts = (configSet) => {
  const configs = Array.from(configSet).map((c) => c.getModelContext()).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return configs.reduce((acc, config) => {
    if (config.system) {
      if (acc.system) {
        acc.system += `

${config.system}`;
      } else {
        acc.system = config.system;
      }
    }
    if (config.tools) {
      for (const [name, tool] of Object.entries(config.tools)) {
        if (acc.tools?.[name]) {
          throw new Error(
            `You tried to define a tool with the name ${name}, but it already exists.`
          );
        }
        if (!acc.tools) acc.tools = {};
        acc.tools[name] = tool;
      }
    }
    if (config.config) {
      acc.config = {
        ...acc.config,
        ...config.config
      };
    }
    if (config.callSettings) {
      acc.callSettings = {
        ...acc.callSettings,
        ...config.callSettings
      };
    }
    return acc;
  }, {});
};

// src/runtimes/edge/EdgeRuntimeRequestOptions.ts
var LanguageModelV1FunctionToolSchema = z.object({
  type: z.literal("function"),
  name: z.string(),
  description: z.string().optional(),
  parameters: z.custom(
    (val) => typeof val === "object" && val !== null
  )
});
var TextContentPartSchema = z.object({
  type: z.literal("text"),
  text: z.string()
});
var ImageContentPartSchema = z.object({
  type: z.literal("image"),
  image: z.string()
});
var FileContentPartSchema = z.object({
  type: z.literal("file"),
  data: z.string(),
  mimeType: z.string()
});
var Unstable_AudioContentPart = z.object({
  type: z.literal("audio"),
  audio: z.object({
    data: z.string(),
    format: z.union([z.literal("mp3"), z.literal("wav")])
  })
});
var CoreToolCallContentPartSchema = z.object({
  type: z.literal("tool-call"),
  toolCallId: z.string(),
  toolName: z.string(),
  args: z.record(z.unknown()),
  result: z.unknown().optional(),
  isError: z.boolean().optional()
});
var CoreUserMessageSchema = z.object({
  role: z.literal("user"),
  content: z.array(
    z.discriminatedUnion("type", [
      TextContentPartSchema,
      ImageContentPartSchema,
      FileContentPartSchema,
      Unstable_AudioContentPart
    ])
  ).min(1).readonly()
});
var CoreAssistantMessageSchema = z.object({
  role: z.literal("assistant"),
  content: z.array(
    z.discriminatedUnion("type", [
      TextContentPartSchema,
      CoreToolCallContentPartSchema
    ])
  ).min(1).readonly()
});
var CoreSystemMessageSchema = z.object({
  role: z.literal("system"),
  content: z.tuple([TextContentPartSchema]).readonly()
});
var CoreMessageSchema = z.discriminatedUnion("role", [
  CoreSystemMessageSchema,
  CoreUserMessageSchema,
  CoreAssistantMessageSchema
]);
var EdgeRuntimeRequestOptionsSchema = z.object({
  system: z.string().optional(),
  messages: z.array(CoreMessageSchema).min(1).readonly(),
  runConfig: z.object({
    custom: z.record(z.unknown()).optional()
  }).optional(),
  tools: z.array(LanguageModelV1FunctionToolSchema).readonly().optional(),
  unstable_assistantMessageId: z.string().optional()
}).merge(LanguageModelV1CallSettingsSchema).merge(LanguageModelConfigSchema);

// src/runtimes/edge/converters/toLanguageModelMessages.ts
var assistantMessageSplitter = () => {
  const stash = [];
  let assistantMessage = {
    role: "assistant",
    content: []
  };
  let toolMessage = {
    role: "tool",
    content: []
  };
  return {
    addTextContentPart: (part) => {
      if (toolMessage.content.length > 0) {
        stash.push(assistantMessage);
        stash.push(toolMessage);
        assistantMessage = {
          role: "assistant",
          content: []
        };
        toolMessage = {
          role: "tool",
          content: []
        };
      }
      assistantMessage.content.push(part);
    },
    addToolCallPart: (part) => {
      assistantMessage.content.push({
        type: "tool-call",
        toolCallId: part.toolCallId,
        toolName: part.toolName,
        args: part.args
      });
      toolMessage.content.push({
        type: "tool-result",
        toolCallId: part.toolCallId,
        toolName: part.toolName,
        result: part.result ?? "<no result>",
        isError: part.isError ?? false
      });
    },
    getMessages: () => {
      if (toolMessage.content.length > 0) {
        return [...stash, assistantMessage, toolMessage];
      }
      return [...stash, assistantMessage];
    }
  };
};
function toLanguageModelMessages(message, options = {}) {
  const includeId = options.unstable_includeId ?? false;
  return message.flatMap((message2) => {
    const role = message2.role;
    switch (role) {
      case "system": {
        return [
          {
            ...includeId ? { unstable_id: message2.id } : {},
            role: "system",
            content: message2.content[0].text
          }
        ];
      }
      case "user": {
        const attachments = "attachments" in message2 ? message2.attachments : [];
        const content = [
          ...message2.content,
          ...attachments.map((a) => a.content).flat()
        ];
        const msg = {
          ...includeId ? { unstable_id: message2.id } : {},
          role: "user",
          content: content.map(
            (part) => {
              const type = part.type;
              switch (type) {
                case "text": {
                  return part;
                }
                case "image": {
                  return {
                    type: "image",
                    image: new URL(part.image)
                  };
                }
                case "file": {
                  return {
                    type: "file",
                    data: new URL(part.data),
                    mimeType: part.mimeType
                  };
                }
                default: {
                  const unhandledType = type;
                  throw new Error(
                    `Unspported content part type: ${unhandledType}`
                  );
                }
              }
            }
          )
        };
        return [msg];
      }
      case "assistant": {
        const splitter = assistantMessageSplitter();
        for (const part of message2.content) {
          const type = part.type;
          switch (type) {
            case "text": {
              splitter.addTextContentPart(part);
              break;
            }
            case "tool-call": {
              splitter.addToolCallPart(part);
              break;
            }
            default: {
              const unhandledType = type;
              throw new Error(`Unhandled content part type: ${unhandledType}`);
            }
          }
        }
        return splitter.getMessages();
      }
      default: {
        const unhandledRole = role;
        throw new Error(`Unknown message role: ${unhandledRole}`);
      }
    }
  });
}

const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const defaultOptions = {
    name: undefined,
    $refStrategy: "root",
    basePath: ["#"],
    effectStrategy: "input",
    pipeStrategy: "all",
    dateStrategy: "format:date-time",
    mapStrategy: "entries",
    removeAdditionalStrategy: "passthrough",
    definitionPath: "definitions",
    target: "jsonSchema7",
    strictUnions: false,
    definitions: {},
    errorMessages: false,
    markdownDescription: false,
    patternStrategy: "escape",
    applyRegexFlags: false,
    emailStrategy: "format:email",
    base64Strategy: "contentEncoding:base64",
    nameStrategy: "ref",
};
const getDefaultOptions = (options) => (typeof options === "string"
    ? {
        ...defaultOptions,
        name: options,
    }
    : {
        ...defaultOptions,
        ...options,
    });

const getRefs = (options) => {
    const _options = getDefaultOptions(options);
    const currentPath = _options.name !== undefined
        ? [..._options.basePath, _options.definitionPath, _options.name]
        : _options.basePath;
    return {
        ..._options,
        currentPath: currentPath,
        propertyPath: undefined,
        seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [
            def._def,
            {
                def: def._def,
                path: [..._options.basePath, _options.definitionPath, name],
                // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
                jsonSchema: undefined,
            },
        ])),
    };
};

function addErrorMessage(res, key, errorMessage, refs) {
    if (!refs?.errorMessages)
        return;
    if (errorMessage) {
        res.errorMessage = {
            ...res.errorMessage,
            [key]: errorMessage,
        };
    }
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
    res[key] = value;
    addErrorMessage(res, key, errorMessage, refs);
}

function parseAnyDef() {
    return {};
}

function parseArrayDef(def, refs) {
    const res = {
        type: "array",
    };
    if (def.type?._def &&
        def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
        res.items = parseDef(def.type._def, {
            ...refs,
            currentPath: [...refs.currentPath, "items"],
        });
    }
    if (def.minLength) {
        setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
    }
    if (def.maxLength) {
        setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
    }
    if (def.exactLength) {
        setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
        setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
    }
    return res;
}

function parseBigintDef(def, refs) {
    const res = {
        type: "integer",
        format: "int64",
    };
    if (!def.checks)
        return res;
    for (const check of def.checks) {
        switch (check.kind) {
            case "min":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMinimum = true;
                    }
                    setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                }
                break;
            case "max":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMaximum = true;
                    }
                    setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                }
                break;
            case "multipleOf":
                setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
                break;
        }
    }
    return res;
}

function parseBooleanDef() {
    return {
        type: "boolean",
    };
}

function parseBrandedDef(_def, refs) {
    return parseDef(_def.type._def, refs);
}

const parseCatchDef = (def, refs) => {
    return parseDef(def.innerType._def, refs);
};

function parseDateDef(def, refs, overrideDateStrategy) {
    const strategy = overrideDateStrategy ?? refs.dateStrategy;
    if (Array.isArray(strategy)) {
        return {
            anyOf: strategy.map((item, i) => parseDateDef(def, refs, item)),
        };
    }
    switch (strategy) {
        case "string":
        case "format:date-time":
            return {
                type: "string",
                format: "date-time",
            };
        case "format:date":
            return {
                type: "string",
                format: "date",
            };
        case "integer":
            return integerDateParser(def, refs);
    }
}
const integerDateParser = (def, refs) => {
    const res = {
        type: "integer",
        format: "unix-time",
    };
    if (refs.target === "openApi3") {
        return res;
    }
    for (const check of def.checks) {
        switch (check.kind) {
            case "min":
                setResponseValueAndErrors(res, "minimum", check.value, // This is in milliseconds
                check.message, refs);
                break;
            case "max":
                setResponseValueAndErrors(res, "maximum", check.value, // This is in milliseconds
                check.message, refs);
                break;
        }
    }
    return res;
};

function parseDefaultDef(_def, refs) {
    return {
        ...parseDef(_def.innerType._def, refs),
        default: _def.defaultValue(),
    };
}

function parseEffectsDef(_def, refs) {
    return refs.effectStrategy === "input"
        ? parseDef(_def.schema._def, refs)
        : {};
}

function parseEnumDef(def) {
    return {
        type: "string",
        enum: Array.from(def.values),
    };
}

const isJsonSchema7AllOfType = (type) => {
    if ("type" in type && type.type === "string")
        return false;
    return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
    const allOf = [
        parseDef(def.left._def, {
            ...refs,
            currentPath: [...refs.currentPath, "allOf", "0"],
        }),
        parseDef(def.right._def, {
            ...refs,
            currentPath: [...refs.currentPath, "allOf", "1"],
        }),
    ].filter((x) => !!x);
    let unevaluatedProperties = refs.target === "jsonSchema2019-09"
        ? { unevaluatedProperties: false }
        : undefined;
    const mergedAllOf = [];
    // If either of the schemas is an allOf, merge them into a single allOf
    allOf.forEach((schema) => {
        if (isJsonSchema7AllOfType(schema)) {
            mergedAllOf.push(...schema.allOf);
            if (schema.unevaluatedProperties === undefined) {
                // If one of the schemas has no unevaluatedProperties set,
                // the merged schema should also have no unevaluatedProperties set
                unevaluatedProperties = undefined;
            }
        }
        else {
            let nestedSchema = schema;
            if ("additionalProperties" in schema &&
                schema.additionalProperties === false) {
                const { additionalProperties, ...rest } = schema;
                nestedSchema = rest;
            }
            else {
                // As soon as one of the schemas has additionalProperties set not to false, we allow unevaluatedProperties
                unevaluatedProperties = undefined;
            }
            mergedAllOf.push(nestedSchema);
        }
    });
    return mergedAllOf.length
        ? {
            allOf: mergedAllOf,
            ...unevaluatedProperties,
        }
        : undefined;
}

function parseLiteralDef(def, refs) {
    const parsedType = typeof def.value;
    if (parsedType !== "bigint" &&
        parsedType !== "number" &&
        parsedType !== "boolean" &&
        parsedType !== "string") {
        return {
            type: Array.isArray(def.value) ? "array" : "object",
        };
    }
    if (refs.target === "openApi3") {
        return {
            type: parsedType === "bigint" ? "integer" : parsedType,
            enum: [def.value],
        };
    }
    return {
        type: parsedType === "bigint" ? "integer" : parsedType,
        const: def.value,
    };
}

let emojiRegex = undefined;
/**
 * Generated from the regular expressions found here as of 2024-05-22:
 * https://github.com/colinhacks/zod/blob/master/src/types.ts.
 *
 * Expressions with /i flag have been changed accordingly.
 */
const zodPatterns = {
    /**
     * `c` was changed to `[cC]` to replicate /i flag
     */
    cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    /**
     * `a-z` was added to replicate /i flag
     */
    email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    /**
     * Constructed a valid Unicode RegExp
     *
     * Lazily instantiate since this type of regex isn't supported
     * in all envs (e.g. React Native).
     *
     * See:
     * https://github.com/colinhacks/zod/issues/2433
     * Fix in Zod:
     * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
     */
    emoji: () => {
        if (emojiRegex === undefined) {
            emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
        }
        return emojiRegex;
    },
    /**
     * Unused
     */
    uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    /**
     * Unused
     */
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    /**
     * Unused
     */
    ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
    nanoid: /^[a-zA-Z0-9_-]{21}$/,
    jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
};
function parseStringDef(def, refs) {
    const res = {
        type: "string",
    };
    if (def.checks) {
        for (const check of def.checks) {
            switch (check.kind) {
                case "min":
                    setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number"
                        ? Math.max(res.minLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "max":
                    setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number"
                        ? Math.min(res.maxLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "email":
                    switch (refs.emailStrategy) {
                        case "format:email":
                            addFormat(res, "email", check.message, refs);
                            break;
                        case "format:idn-email":
                            addFormat(res, "idn-email", check.message, refs);
                            break;
                        case "pattern:zod":
                            addPattern(res, zodPatterns.email, check.message, refs);
                            break;
                    }
                    break;
                case "url":
                    addFormat(res, "uri", check.message, refs);
                    break;
                case "uuid":
                    addFormat(res, "uuid", check.message, refs);
                    break;
                case "regex":
                    addPattern(res, check.regex, check.message, refs);
                    break;
                case "cuid":
                    addPattern(res, zodPatterns.cuid, check.message, refs);
                    break;
                case "cuid2":
                    addPattern(res, zodPatterns.cuid2, check.message, refs);
                    break;
                case "startsWith":
                    addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
                    break;
                case "endsWith":
                    addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
                    break;
                case "datetime":
                    addFormat(res, "date-time", check.message, refs);
                    break;
                case "date":
                    addFormat(res, "date", check.message, refs);
                    break;
                case "time":
                    addFormat(res, "time", check.message, refs);
                    break;
                case "duration":
                    addFormat(res, "duration", check.message, refs);
                    break;
                case "length":
                    setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number"
                        ? Math.max(res.minLength, check.value)
                        : check.value, check.message, refs);
                    setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number"
                        ? Math.min(res.maxLength, check.value)
                        : check.value, check.message, refs);
                    break;
                case "includes": {
                    addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
                    break;
                }
                case "ip": {
                    if (check.version !== "v6") {
                        addFormat(res, "ipv4", check.message, refs);
                    }
                    if (check.version !== "v4") {
                        addFormat(res, "ipv6", check.message, refs);
                    }
                    break;
                }
                case "base64url":
                    addPattern(res, zodPatterns.base64url, check.message, refs);
                    break;
                case "jwt":
                    addPattern(res, zodPatterns.jwt, check.message, refs);
                    break;
                case "cidr": {
                    if (check.version !== "v6") {
                        addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
                    }
                    if (check.version !== "v4") {
                        addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
                    }
                    break;
                }
                case "emoji":
                    addPattern(res, zodPatterns.emoji(), check.message, refs);
                    break;
                case "ulid": {
                    addPattern(res, zodPatterns.ulid, check.message, refs);
                    break;
                }
                case "base64": {
                    switch (refs.base64Strategy) {
                        case "format:binary": {
                            addFormat(res, "binary", check.message, refs);
                            break;
                        }
                        case "contentEncoding:base64": {
                            setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
                            break;
                        }
                        case "pattern:zod": {
                            addPattern(res, zodPatterns.base64, check.message, refs);
                            break;
                        }
                    }
                    break;
                }
                case "nanoid": {
                    addPattern(res, zodPatterns.nanoid, check.message, refs);
                }
            }
        }
    }
    return res;
}
function escapeLiteralCheckValue(literal, refs) {
    return refs.patternStrategy === "escape"
        ? escapeNonAlphaNumeric(literal)
        : literal;
}
const ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
    let result = "";
    for (let i = 0; i < source.length; i++) {
        if (!ALPHA_NUMERIC.has(source[i])) {
            result += "\\";
        }
        result += source[i];
    }
    return result;
}
// Adds a "format" keyword to the schema. If a format exists, both formats will be joined in an allOf-node, along with subsequent ones.
function addFormat(schema, value, message, refs) {
    if (schema.format || schema.anyOf?.some((x) => x.format)) {
        if (!schema.anyOf) {
            schema.anyOf = [];
        }
        if (schema.format) {
            schema.anyOf.push({
                format: schema.format,
                ...(schema.errorMessage &&
                    refs.errorMessages && {
                    errorMessage: { format: schema.errorMessage.format },
                }),
            });
            delete schema.format;
            if (schema.errorMessage) {
                delete schema.errorMessage.format;
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
            }
        }
        schema.anyOf.push({
            format: value,
            ...(message &&
                refs.errorMessages && { errorMessage: { format: message } }),
        });
    }
    else {
        setResponseValueAndErrors(schema, "format", value, message, refs);
    }
}
// Adds a "pattern" keyword to the schema. If a pattern exists, both patterns will be joined in an allOf-node, along with subsequent ones.
function addPattern(schema, regex, message, refs) {
    if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
        if (!schema.allOf) {
            schema.allOf = [];
        }
        if (schema.pattern) {
            schema.allOf.push({
                pattern: schema.pattern,
                ...(schema.errorMessage &&
                    refs.errorMessages && {
                    errorMessage: { pattern: schema.errorMessage.pattern },
                }),
            });
            delete schema.pattern;
            if (schema.errorMessage) {
                delete schema.errorMessage.pattern;
                if (Object.keys(schema.errorMessage).length === 0) {
                    delete schema.errorMessage;
                }
            }
        }
        schema.allOf.push({
            pattern: stringifyRegExpWithFlags(regex, refs),
            ...(message &&
                refs.errorMessages && { errorMessage: { pattern: message } }),
        });
    }
    else {
        setResponseValueAndErrors(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
    }
}
// Mutate z.string.regex() in a best attempt to accommodate for regex flags when applyRegexFlags is true
function stringifyRegExpWithFlags(regex, refs) {
    if (!refs.applyRegexFlags || !regex.flags) {
        return regex.source;
    }
    // Currently handled flags
    const flags = {
        i: regex.flags.includes("i"),
        m: regex.flags.includes("m"),
        s: regex.flags.includes("s"), // `.` matches newlines
    };
    // The general principle here is to step through each character, one at a time, applying mutations as flags require. We keep track when the current character is escaped, and when it's inside a group /like [this]/ or (also) a range like /[a-z]/. The following is fairly brittle imperative code; edit at your peril!
    const source = flags.i ? regex.source.toLowerCase() : regex.source;
    let pattern = "";
    let isEscaped = false;
    let inCharGroup = false;
    let inCharRange = false;
    for (let i = 0; i < source.length; i++) {
        if (isEscaped) {
            pattern += source[i];
            isEscaped = false;
            continue;
        }
        if (flags.i) {
            if (inCharGroup) {
                if (source[i].match(/[a-z]/)) {
                    if (inCharRange) {
                        pattern += source[i];
                        pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
                        inCharRange = false;
                    }
                    else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
                        pattern += source[i];
                        inCharRange = true;
                    }
                    else {
                        pattern += `${source[i]}${source[i].toUpperCase()}`;
                    }
                    continue;
                }
            }
            else if (source[i].match(/[a-z]/)) {
                pattern += `[${source[i]}${source[i].toUpperCase()}]`;
                continue;
            }
        }
        if (flags.m) {
            if (source[i] === "^") {
                pattern += `(^|(?<=[\r\n]))`;
                continue;
            }
            else if (source[i] === "$") {
                pattern += `($|(?=[\r\n]))`;
                continue;
            }
        }
        if (flags.s && source[i] === ".") {
            pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
            continue;
        }
        pattern += source[i];
        if (source[i] === "\\") {
            isEscaped = true;
        }
        else if (inCharGroup && source[i] === "]") {
            inCharGroup = false;
        }
        else if (!inCharGroup && source[i] === "[") {
            inCharGroup = true;
        }
    }
    try {
        new RegExp(pattern);
    }
    catch {
        console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
        return regex.source;
    }
    return pattern;
}

function parseRecordDef(def, refs) {
    if (refs.target === "openAi") {
        console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
    }
    if (refs.target === "openApi3" &&
        def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
        return {
            type: "object",
            required: def.keyType._def.values,
            properties: def.keyType._def.values.reduce((acc, key) => ({
                ...acc,
                [key]: parseDef(def.valueType._def, {
                    ...refs,
                    currentPath: [...refs.currentPath, "properties", key],
                }) ?? {},
            }), {}),
            additionalProperties: false,
        };
    }
    const schema = {
        type: "object",
        additionalProperties: parseDef(def.valueType._def, {
            ...refs,
            currentPath: [...refs.currentPath, "additionalProperties"],
        }) ?? {},
    };
    if (refs.target === "openApi3") {
        return schema;
    }
    if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString &&
        def.keyType._def.checks?.length) {
        const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType,
        };
    }
    else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
        return {
            ...schema,
            propertyNames: {
                enum: def.keyType._def.values,
            },
        };
    }
    else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded &&
        def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString &&
        def.keyType._def.type._def.checks?.length) {
        const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
        return {
            ...schema,
            propertyNames: keyType,
        };
    }
    return schema;
}

function parseMapDef(def, refs) {
    if (refs.mapStrategy === "record") {
        return parseRecordDef(def, refs);
    }
    const keys = parseDef(def.keyType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", "items", "0"],
    }) || {};
    const values = parseDef(def.valueType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", "items", "1"],
    }) || {};
    return {
        type: "array",
        maxItems: 125,
        items: {
            type: "array",
            items: [keys, values],
            minItems: 2,
            maxItems: 2,
        },
    };
}

function parseNativeEnumDef(def) {
    const object = def.values;
    const actualKeys = Object.keys(def.values).filter((key) => {
        return typeof object[object[key]] !== "number";
    });
    const actualValues = actualKeys.map((key) => object[key]);
    const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
    return {
        type: parsedTypes.length === 1
            ? parsedTypes[0] === "string"
                ? "string"
                : "number"
            : ["string", "number"],
        enum: actualValues,
    };
}

function parseNeverDef() {
    return {
        not: {},
    };
}

function parseNullDef(refs) {
    return refs.target === "openApi3"
        ? {
            enum: ["null"],
            nullable: true,
        }
        : {
            type: "null",
        };
}

const primitiveMappings = {
    ZodString: "string",
    ZodNumber: "number",
    ZodBigInt: "integer",
    ZodBoolean: "boolean",
    ZodNull: "null",
};
function parseUnionDef(def, refs) {
    if (refs.target === "openApi3")
        return asAnyOf(def, refs);
    const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
    // This blocks tries to look ahead a bit to produce nicer looking schemas with type array instead of anyOf.
    if (options.every((x) => x._def.typeName in primitiveMappings &&
        (!x._def.checks || !x._def.checks.length))) {
        // all types in union are primitive and lack checks, so might as well squash into {type: [...]}
        const types = options.reduce((types, x) => {
            const type = primitiveMappings[x._def.typeName]; //Can be safely casted due to row 43
            return type && !types.includes(type) ? [...types, type] : types;
        }, []);
        return {
            type: types.length > 1 ? types : types[0],
        };
    }
    else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
        // all options literals
        const types = options.reduce((acc, x) => {
            const type = typeof x._def.value;
            switch (type) {
                case "string":
                case "number":
                case "boolean":
                    return [...acc, type];
                case "bigint":
                    return [...acc, "integer"];
                case "object":
                    if (x._def.value === null)
                        return [...acc, "null"];
                case "symbol":
                case "undefined":
                case "function":
                default:
                    return acc;
            }
        }, []);
        if (types.length === options.length) {
            // all the literals are primitive, as far as null can be considered primitive
            const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
            return {
                type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
                enum: options.reduce((acc, x) => {
                    return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
                }, []),
            };
        }
    }
    else if (options.every((x) => x._def.typeName === "ZodEnum")) {
        return {
            type: "string",
            enum: options.reduce((acc, x) => [
                ...acc,
                ...x._def.values.filter((x) => !acc.includes(x)),
            ], []),
        };
    }
    return asAnyOf(def, refs);
}
const asAnyOf = (def, refs) => {
    const anyOf = (def.options instanceof Map
        ? Array.from(def.options.values())
        : def.options)
        .map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", `${i}`],
    }))
        .filter((x) => !!x &&
        (!refs.strictUnions ||
            (typeof x === "object" && Object.keys(x).length > 0)));
    return anyOf.length ? { anyOf } : undefined;
};

function parseNullableDef(def, refs) {
    if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) &&
        (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
        if (refs.target === "openApi3") {
            return {
                type: primitiveMappings[def.innerType._def.typeName],
                nullable: true,
            };
        }
        return {
            type: [
                primitiveMappings[def.innerType._def.typeName],
                "null",
            ],
        };
    }
    if (refs.target === "openApi3") {
        const base = parseDef(def.innerType._def, {
            ...refs,
            currentPath: [...refs.currentPath],
        });
        if (base && "$ref" in base)
            return { allOf: [base], nullable: true };
        return base && { ...base, nullable: true };
    }
    const base = parseDef(def.innerType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", "0"],
    });
    return base && { anyOf: [base, { type: "null" }] };
}

function parseNumberDef(def, refs) {
    const res = {
        type: "number",
    };
    if (!def.checks)
        return res;
    for (const check of def.checks) {
        switch (check.kind) {
            case "int":
                res.type = "integer";
                addErrorMessage(res, "type", check.message, refs);
                break;
            case "min":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMinimum = true;
                    }
                    setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
                }
                break;
            case "max":
                if (refs.target === "jsonSchema7") {
                    if (check.inclusive) {
                        setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                    }
                    else {
                        setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
                    }
                }
                else {
                    if (!check.inclusive) {
                        res.exclusiveMaximum = true;
                    }
                    setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
                }
                break;
            case "multipleOf":
                setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
                break;
        }
    }
    return res;
}

function decideAdditionalProperties(def, refs) {
    if (refs.removeAdditionalStrategy === "strict") {
        return def.catchall._def.typeName === "ZodNever"
            ? def.unknownKeys !== "strict"
            : parseDef(def.catchall._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalProperties"],
            }) ?? true;
    }
    else {
        return def.catchall._def.typeName === "ZodNever"
            ? def.unknownKeys === "passthrough"
            : parseDef(def.catchall._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalProperties"],
            }) ?? true;
    }
}
function parseObjectDef(def, refs) {
    const forceOptionalIntoNullable = refs.target === "openAi";
    const result = {
        type: "object",
        ...Object.entries(def.shape()).reduce((acc, [propName, propDef]) => {
            if (propDef === undefined || propDef._def === undefined)
                return acc;
            let propOptional = propDef.isOptional();
            if (propOptional && forceOptionalIntoNullable) {
                if (propDef instanceof ZodOptional) {
                    propDef = propDef._def.innerType;
                }
                if (!propDef.isNullable()) {
                    propDef = propDef.nullable();
                }
                propOptional = false;
            }
            const parsedDef = parseDef(propDef._def, {
                ...refs,
                currentPath: [...refs.currentPath, "properties", propName],
                propertyPath: [...refs.currentPath, "properties", propName],
            });
            if (parsedDef === undefined)
                return acc;
            return {
                properties: { ...acc.properties, [propName]: parsedDef },
                required: propOptional ? acc.required : [...acc.required, propName],
            };
        }, { properties: {}, required: [] }),
        additionalProperties: decideAdditionalProperties(def, refs),
    };
    if (!result.required.length)
        delete result.required;
    return result;
}

const parseOptionalDef = (def, refs) => {
    if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
        return parseDef(def.innerType._def, refs);
    }
    const innerSchema = parseDef(def.innerType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", "1"],
    });
    return innerSchema
        ? {
            anyOf: [
                {
                    not: {},
                },
                innerSchema,
            ],
        }
        : {};
};

const parsePipelineDef = (def, refs) => {
    if (refs.pipeStrategy === "input") {
        return parseDef(def.in._def, refs);
    }
    else if (refs.pipeStrategy === "output") {
        return parseDef(def.out._def, refs);
    }
    const a = parseDef(def.in._def, {
        ...refs,
        currentPath: [...refs.currentPath, "allOf", "0"],
    });
    const b = parseDef(def.out._def, {
        ...refs,
        currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"],
    });
    return {
        allOf: [a, b].filter((x) => x !== undefined),
    };
};

function parsePromiseDef(def, refs) {
    return parseDef(def.type._def, refs);
}

function parseSetDef(def, refs) {
    const items = parseDef(def.valueType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items"],
    });
    const schema = {
        type: "array",
        uniqueItems: true,
        items,
    };
    if (def.minSize) {
        setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
    }
    if (def.maxSize) {
        setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
    }
    return schema;
}

function parseTupleDef(def, refs) {
    if (def.rest) {
        return {
            type: "array",
            minItems: def.items.length,
            items: def.items
                .map((x, i) => parseDef(x._def, {
                ...refs,
                currentPath: [...refs.currentPath, "items", `${i}`],
            }))
                .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
            additionalItems: parseDef(def.rest._def, {
                ...refs,
                currentPath: [...refs.currentPath, "additionalItems"],
            }),
        };
    }
    else {
        return {
            type: "array",
            minItems: def.items.length,
            maxItems: def.items.length,
            items: def.items
                .map((x, i) => parseDef(x._def, {
                ...refs,
                currentPath: [...refs.currentPath, "items", `${i}`],
            }))
                .reduce((acc, x) => (x === undefined ? acc : [...acc, x]), []),
        };
    }
}

function parseUndefinedDef() {
    return {
        not: {},
    };
}

function parseUnknownDef() {
    return {};
}

const parseReadonlyDef = (def, refs) => {
    return parseDef(def.innerType._def, refs);
};

function parseDef(def, refs, forceResolution = false) {
    const seenItem = refs.seen.get(def);
    if (refs.override) {
        const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
        if (overrideResult !== ignoreOverride) {
            return overrideResult;
        }
    }
    if (seenItem && !forceResolution) {
        const seenSchema = get$ref(seenItem, refs);
        if (seenSchema !== undefined) {
            return seenSchema;
        }
    }
    const newItem = { def, path: refs.currentPath, jsonSchema: undefined };
    refs.seen.set(def, newItem);
    const jsonSchema = selectParser(def, def.typeName, refs);
    if (jsonSchema) {
        addMeta(def, refs, jsonSchema);
    }
    newItem.jsonSchema = jsonSchema;
    return jsonSchema;
}
const get$ref = (item, refs) => {
    switch (refs.$refStrategy) {
        case "root":
            return { $ref: item.path.join("/") };
        case "relative":
            return { $ref: getRelativePath(refs.currentPath, item.path) };
        case "none":
        case "seen": {
            if (item.path.length < refs.currentPath.length &&
                item.path.every((value, index) => refs.currentPath[index] === value)) {
                console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
                return {};
            }
            return refs.$refStrategy === "seen" ? {} : undefined;
        }
    }
};
const getRelativePath = (pathA, pathB) => {
    let i = 0;
    for (; i < pathA.length && i < pathB.length; i++) {
        if (pathA[i] !== pathB[i])
            break;
    }
    return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
const selectParser = (def, typeName, refs) => {
    switch (typeName) {
        case ZodFirstPartyTypeKind.ZodString:
            return parseStringDef(def, refs);
        case ZodFirstPartyTypeKind.ZodNumber:
            return parseNumberDef(def, refs);
        case ZodFirstPartyTypeKind.ZodObject:
            return parseObjectDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBigInt:
            return parseBigintDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBoolean:
            return parseBooleanDef();
        case ZodFirstPartyTypeKind.ZodDate:
            return parseDateDef(def, refs);
        case ZodFirstPartyTypeKind.ZodUndefined:
            return parseUndefinedDef();
        case ZodFirstPartyTypeKind.ZodNull:
            return parseNullDef(refs);
        case ZodFirstPartyTypeKind.ZodArray:
            return parseArrayDef(def, refs);
        case ZodFirstPartyTypeKind.ZodUnion:
        case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return parseUnionDef(def, refs);
        case ZodFirstPartyTypeKind.ZodIntersection:
            return parseIntersectionDef(def, refs);
        case ZodFirstPartyTypeKind.ZodTuple:
            return parseTupleDef(def, refs);
        case ZodFirstPartyTypeKind.ZodRecord:
            return parseRecordDef(def, refs);
        case ZodFirstPartyTypeKind.ZodLiteral:
            return parseLiteralDef(def, refs);
        case ZodFirstPartyTypeKind.ZodEnum:
            return parseEnumDef(def);
        case ZodFirstPartyTypeKind.ZodNativeEnum:
            return parseNativeEnumDef(def);
        case ZodFirstPartyTypeKind.ZodNullable:
            return parseNullableDef(def, refs);
        case ZodFirstPartyTypeKind.ZodOptional:
            return parseOptionalDef(def, refs);
        case ZodFirstPartyTypeKind.ZodMap:
            return parseMapDef(def, refs);
        case ZodFirstPartyTypeKind.ZodSet:
            return parseSetDef(def, refs);
        case ZodFirstPartyTypeKind.ZodLazy:
            return parseDef(def.getter()._def, refs);
        case ZodFirstPartyTypeKind.ZodPromise:
            return parsePromiseDef(def, refs);
        case ZodFirstPartyTypeKind.ZodNaN:
        case ZodFirstPartyTypeKind.ZodNever:
            return parseNeverDef();
        case ZodFirstPartyTypeKind.ZodEffects:
            return parseEffectsDef(def, refs);
        case ZodFirstPartyTypeKind.ZodAny:
            return parseAnyDef();
        case ZodFirstPartyTypeKind.ZodUnknown:
            return parseUnknownDef();
        case ZodFirstPartyTypeKind.ZodDefault:
            return parseDefaultDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBranded:
            return parseBrandedDef(def, refs);
        case ZodFirstPartyTypeKind.ZodReadonly:
            return parseReadonlyDef(def, refs);
        case ZodFirstPartyTypeKind.ZodCatch:
            return parseCatchDef(def, refs);
        case ZodFirstPartyTypeKind.ZodPipeline:
            return parsePipelineDef(def, refs);
        case ZodFirstPartyTypeKind.ZodFunction:
        case ZodFirstPartyTypeKind.ZodVoid:
        case ZodFirstPartyTypeKind.ZodSymbol:
            return undefined;
        default:
            /* c8 ignore next */
            return ((_) => undefined)();
    }
};
const addMeta = (def, refs, jsonSchema) => {
    if (def.description) {
        jsonSchema.description = def.description;
        if (refs.markdownDescription) {
            jsonSchema.markdownDescription = def.description;
        }
    }
    return jsonSchema;
};

const zodToJsonSchema = (schema, options) => {
    const refs = getRefs(options);
    const definitions = typeof options === "object" && options.definitions
        ? Object.entries(options.definitions).reduce((acc, [name, schema]) => ({
            ...acc,
            [name]: parseDef(schema._def, {
                ...refs,
                currentPath: [...refs.basePath, refs.definitionPath, name],
            }, true) ?? {},
        }), {})
        : undefined;
    const name = typeof options === "string"
        ? options
        : options?.nameStrategy === "title"
            ? undefined
            : options?.name;
    const main = parseDef(schema._def, name === undefined
        ? refs
        : {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name],
        }, false) ?? {};
    const title = typeof options === "object" &&
        options.name !== undefined &&
        options.nameStrategy === "title"
        ? options.name
        : undefined;
    if (title !== undefined) {
        main.title = title;
    }
    const combined = name === undefined
        ? definitions
            ? {
                ...main,
                [refs.definitionPath]: definitions,
            }
            : main
        : {
            $ref: [
                ...(refs.$refStrategy === "relative" ? [] : refs.basePath),
                refs.definitionPath,
                name,
            ].join("/"),
            [refs.definitionPath]: {
                ...definitions,
                [name]: main,
            },
        };
    if (refs.target === "jsonSchema7") {
        combined.$schema = "http://json-schema.org/draft-07/schema#";
    }
    else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") {
        combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
    }
    if (refs.target === "openAi" &&
        ("anyOf" in combined ||
            "oneOf" in combined ||
            "allOf" in combined ||
            ("type" in combined && Array.isArray(combined.type)))) {
        console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
    }
    return combined;
};

// src/runtimes/edge/converters/toLanguageModelTools.ts
var toLanguageModelTools = (tools) => {
  return Object.entries(tools).map(([name, tool]) => ({
    type: "function",
    name,
    ...tool.description ? { description: tool.description } : undefined,
    parameters: tool.parameters instanceof z.ZodType ? zodToJsonSchema(tool.parameters) : tool.parameters
  }));
};

var secureJsonParse = {exports: {}};

var hasRequiredSecureJsonParse;

function requireSecureJsonParse () {
	if (hasRequiredSecureJsonParse) return secureJsonParse.exports;
	hasRequiredSecureJsonParse = 1;

	const hasBuffer = typeof Buffer !== 'undefined';
	const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
	const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;

	function _parse (text, reviver, options) {
	  // Normalize arguments
	  if (options == null) {
	    if (reviver !== null && typeof reviver === 'object') {
	      options = reviver;
	      reviver = undefined;
	    }
	  }

	  if (hasBuffer && Buffer.isBuffer(text)) {
	    text = text.toString();
	  }

	  // BOM checker
	  if (text && text.charCodeAt(0) === 0xFEFF) {
	    text = text.slice(1);
	  }

	  // Parse normally, allowing exceptions
	  const obj = JSON.parse(text, reviver);

	  // Ignore null and non-objects
	  if (obj === null || typeof obj !== 'object') {
	    return obj
	  }

	  const protoAction = (options && options.protoAction) || 'error';
	  const constructorAction = (options && options.constructorAction) || 'error';

	  // options: 'error' (default) / 'remove' / 'ignore'
	  if (protoAction === 'ignore' && constructorAction === 'ignore') {
	    return obj
	  }

	  if (protoAction !== 'ignore' && constructorAction !== 'ignore') {
	    if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
	      return obj
	    }
	  } else if (protoAction !== 'ignore' && constructorAction === 'ignore') {
	    if (suspectProtoRx.test(text) === false) {
	      return obj
	    }
	  } else {
	    if (suspectConstructorRx.test(text) === false) {
	      return obj
	    }
	  }

	  // Scan result for proto keys
	  return filter(obj, { protoAction, constructorAction, safe: options && options.safe })
	}

	function filter (obj, { protoAction = 'error', constructorAction = 'error', safe } = {}) {
	  let next = [obj];

	  while (next.length) {
	    const nodes = next;
	    next = [];

	    for (const node of nodes) {
	      if (protoAction !== 'ignore' && Object.prototype.hasOwnProperty.call(node, '__proto__')) { // Avoid calling node.hasOwnProperty directly
	        if (safe === true) {
	          return null
	        } else if (protoAction === 'error') {
	          throw new SyntaxError('Object contains forbidden prototype property')
	        }

	        delete node.__proto__; // eslint-disable-line no-proto
	      }

	      if (constructorAction !== 'ignore' &&
	          Object.prototype.hasOwnProperty.call(node, 'constructor') &&
	          Object.prototype.hasOwnProperty.call(node.constructor, 'prototype')) { // Avoid calling node.hasOwnProperty directly
	        if (safe === true) {
	          return null
	        } else if (constructorAction === 'error') {
	          throw new SyntaxError('Object contains forbidden prototype property')
	        }

	        delete node.constructor;
	      }

	      for (const key in node) {
	        const value = node[key];
	        if (value && typeof value === 'object') {
	          next.push(value);
	        }
	      }
	    }
	  }
	  return obj
	}

	function parse (text, reviver, options) {
	  const { stackTraceLimit } = Error;
	  Error.stackTraceLimit = 0;
	  try {
	    return _parse(text, reviver, options)
	  } finally {
	    Error.stackTraceLimit = stackTraceLimit;
	  }
	}

	function safeParse (text, reviver) {
	  const { stackTraceLimit } = Error;
	  Error.stackTraceLimit = 0;
	  try {
	    return _parse(text, reviver, { safe: true })
	  } catch (_e) {
	    return null
	  } finally {
	    Error.stackTraceLimit = stackTraceLimit;
	  }
	}

	secureJsonParse.exports = parse;
	secureJsonParse.exports.default = parse;
	secureJsonParse.exports.parse = parse;
	secureJsonParse.exports.safeParse = safeParse;
	secureJsonParse.exports.scan = filter;
	return secureJsonParse.exports;
}

var secureJsonParseExports = requireSecureJsonParse();
const sjson = /*@__PURE__*/getDefaultExportFromCjs(secureJsonParseExports);

// src/runtimes/edge/streams/toolResultStream.ts
function toolResultStream(tools, abortSignal) {
  const toolCallExecutions = /* @__PURE__ */ new Map();
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk);
      const chunkType = chunk.type;
      switch (chunkType) {
        case "tool-call": {
          const { toolCallId, toolCallType, toolName, args: argsText } = chunk;
          const tool = tools?.[toolName];
          if (!tool || !tool.execute) return;
          let args;
          try {
            args = sjson.parse(argsText);
          } catch (e) {
            controller.enqueue({
              type: "tool-result",
              toolCallType,
              toolCallId,
              toolName,
              result: "Function parameter parsing failed. " + JSON.stringify(e.message),
              isError: true
            });
            return;
          }
          if (tool.parameters instanceof z.ZodType) {
            const result = tool.parameters.safeParse(args);
            if (!result.success) {
              controller.enqueue({
                type: "tool-result",
                toolCallType,
                toolCallId,
                toolName,
                result: "Function parameter validation failed. " + JSON.stringify(result.error.issues),
                isError: true
              });
              return;
            }
          }
          toolCallExecutions.set(
            toolCallId,
            (async () => {
              if (!tool.execute) return;
              try {
                const result = await tool.execute(args, { abortSignal });
                controller.enqueue({
                  type: "tool-result",
                  toolCallType,
                  toolCallId,
                  toolName,
                  result
                });
              } catch (error) {
                controller.enqueue({
                  type: "tool-result",
                  toolCallType,
                  toolCallId,
                  toolName,
                  result: "Error: " + error,
                  isError: true
                });
              } finally {
                toolCallExecutions.delete(toolCallId);
              }
            })()
          );
          break;
        }
        // ignore other parts
        case "text-delta":
        case "tool-call-delta":
        case "tool-result":
        case "step-finish":
        case "finish":
        case "error":
        case "response-metadata":
        case "annotations":
        case "data":
          break;
        default: {
          const unhandledType = chunkType;
          throw new Error(`Unhandled chunk type: ${unhandledType}`);
        }
      }
    },
    async flush() {
      await Promise.all(toolCallExecutions.values());
    }
  });
}

// src/runtimes/edge/partial-json/fix-json.ts
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  function processValueStart(char, i, swapState) {
    {
      switch (char) {
        case '"': {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_STRING");
          break;
        }
        case "f":
        case "t":
        case "n": {
          lastValidIndex = i;
          literalStart = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_LITERAL");
          break;
        }
        case "-": {
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "{": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_OBJECT_START");
          break;
        }
        case "[": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_ARRAY_START");
          break;
        }
      }
    }
  }
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        lastValidIndex = i;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return result;
}

// src/runtimes/edge/partial-json/parse-partial-json.ts
var parsePartialJson = (json) => {
  try {
    return sjson.parse(json);
  } catch {
    try {
      return sjson.parse(fixJson(json));
    } catch {
      return undefined;
    }
  }
};

// src/runtimes/edge/streams/runResultStream.ts
function runResultStream() {
  let message = {
    content: [],
    status: { type: "running" }
  };
  return new TransformStream({
    transform(chunk, controller) {
      const chunkType = chunk.type;
      switch (chunkType) {
        case "text-delta": {
          message = appendOrUpdateText(message, chunk.textDelta);
          controller.enqueue(message);
          break;
        }
        case "tool-call-delta": {
          const { toolCallId, toolName, argsTextDelta } = chunk;
          message = appendOrUpdateToolCall(
            message,
            toolCallId,
            toolName,
            argsTextDelta
          );
          controller.enqueue(message);
          break;
        }
        case "tool-call":
        // ignoring tool call events because they are converted to tool-call-delta as well
        case "response-metadata":
          break;
        case "annotations": {
          message = appendAnnotations(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "data": {
          message = appendData(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "tool-result": {
          message = appendOrUpdateToolResult(
            message,
            chunk.toolCallId,
            chunk.toolName,
            chunk.result
          );
          controller.enqueue(message);
          break;
        }
        case "step-finish": {
          message = appendStepFinish(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "finish": {
          message = appendOrUpdateFinish(message, chunk);
          controller.enqueue(message);
          break;
        }
        case "error": {
          if (chunk.error instanceof Error && chunk.error.name === "AbortError") {
            message = appendOrUpdateCancel(message);
            controller.enqueue(message);
            break;
          } else {
            throw chunk.error;
          }
        }
        default: {
          const unhandledType = chunkType;
          throw new Error(`Unhandled chunk type: ${unhandledType}`);
        }
      }
    },
    flush(controller) {
      if (message.status?.type === "running") {
        const requiresAction = message.content?.at(-1)?.type === "tool-call";
        message = appendOrUpdateFinish(message, {
          type: "finish",
          finishReason: requiresAction ? "tool-calls" : "unknown",
          usage: {
            promptTokens: 0,
            completionTokens: 0
          }
        });
        controller.enqueue(message);
      }
    }
  });
}
var appendOrUpdateText = (message, textDelta) => {
  let contentParts = message.content ?? [];
  let contentPart = message.content?.at(-1);
  if (contentPart?.type !== "text") {
    contentPart = { type: "text", text: textDelta };
  } else {
    contentParts = contentParts.slice(0, -1);
    contentPart = { type: "text", text: contentPart.text + textDelta };
  }
  return {
    ...message,
    content: contentParts.concat([contentPart])
  };
};
var appendOrUpdateToolCall = (message, toolCallId, toolName, argsTextDelta) => {
  let contentParts = message.content ?? [];
  const contentPartIdx = contentParts.findIndex(
    (c) => c.type === "tool-call" && c.toolCallId === toolCallId
  );
  let contentPart = contentPartIdx === -1 ? null : contentParts[contentPartIdx];
  if (contentPart == null) {
    contentPart = {
      type: "tool-call",
      toolCallId,
      toolName,
      argsText: argsTextDelta,
      args: parsePartialJson(argsTextDelta)
    };
    contentParts = [...contentParts, contentPart];
  } else {
    const argsText = contentPart.argsText + argsTextDelta;
    contentPart = {
      ...contentPart,
      argsText,
      args: parsePartialJson(argsText)
    };
    contentParts = [
      ...contentParts.slice(0, contentPartIdx),
      contentPart,
      ...contentParts.slice(contentPartIdx + 1)
    ];
  }
  return {
    ...message,
    content: contentParts
  };
};
var appendOrUpdateToolResult = (message, toolCallId, toolName, result) => {
  let found = false;
  const newContentParts = message.content?.map((part) => {
    if (part.type !== "tool-call" || part.toolCallId !== toolCallId)
      return part;
    found = true;
    if (part.toolName !== toolName)
      throw new Error(
        `Tool call ${toolCallId} found with tool name ${part.toolName}, but expected ${toolName}`
      );
    return {
      ...part,
      result
    };
  });
  if (!found)
    throw new Error(
      `Received tool result for unknown tool call "${toolName}" / "${toolCallId}". This is likely an internal bug in assistant-ui.`
    );
  return {
    ...message,
    content: newContentParts
  };
};
var appendAnnotations = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_annotations: [
        ...message.metadata?.unstable_annotations ?? [],
        ...chunk.annotations
      ]
    }
  };
};
var appendData = (message, chunk) => {
  return {
    ...message,
    metadata: {
      ...message.metadata,
      unstable_data: [
        ...message.metadata?.unstable_data ?? [],
        ...chunk.data
      ]
    }
  };
};
var appendStepFinish = (message, chunk) => {
  const { type, ...rest } = chunk;
  const steps = [
    ...message.metadata?.steps ?? [],
    {
      usage: rest.usage
    }
  ];
  return {
    ...message,
    metadata: {
      ...message.metadata,
      steps
    }
  };
};
var appendOrUpdateFinish = (message, chunk) => {
  const { type, ...rest } = chunk;
  const steps = [
    ...message.metadata?.steps ?? [],
    {
      logprobs: rest.logprobs,
      usage: rest.usage
    }
  ];
  return {
    ...message,
    status: getStatus(chunk),
    metadata: {
      ...message.metadata,
      steps
    }
  };
};
var getStatus = (chunk) => {
  if (chunk.finishReason === "tool-calls") {
    return {
      type: "requires-action",
      reason: "tool-calls"
    };
  } else if (chunk.finishReason === "stop" || chunk.finishReason === "unknown") {
    return {
      type: "complete",
      reason: chunk.finishReason
    };
  } else {
    return {
      type: "incomplete",
      reason: chunk.finishReason
    };
  }
};
var appendOrUpdateCancel = (message) => {
  return {
    ...message,
    status: {
      type: "incomplete",
      reason: "cancelled"
    }
  };
};

// src/runtimes/edge/streams/utils/PipeableTransformStream.ts
var PipeableTransformStream = class extends TransformStream {
  constructor(transform) {
    super();
    const readable = transform(super.readable);
    Object.defineProperty(this, "readable", {
      value: readable,
      writable: false
    });
  }
};

// src/runtimes/edge/streams/utils/streamPartEncoderStream.ts
function encodeStreamPart({
  type,
  value
}) {
  return `${type}:${JSON.stringify(value)}
`;
}
function streamPartEncoderStream() {
  const encodeStream = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(encodeStreamPart(chunk));
    }
  });
  return new PipeableTransformStream((readable) => {
    return readable.pipeThrough(encodeStream).pipeThrough(new TextEncoderStream());
  });
}

// src/runtimes/edge/createEdgeRuntimeAPI.ts
var voidStream = () => {
  return new WritableStream({
    abort(reason) {
      console.error("Server stream processing aborted:", reason);
    }
  });
};
var getEdgeRuntimeStream = async ({
  abortSignal,
  requestData: unsafeRequest,
  options: {
    model: modelOrCreator,
    system: serverSystem,
    tools: serverTools = {},
    toolChoice,
    onFinish,
    ...unsafeSettings
  }
}) => {
  const settings = LanguageModelV1CallSettingsSchema.parse(unsafeSettings);
  const lmServerTools = toLanguageModelTools(serverTools);
  const hasServerTools = Object.values(serverTools).some((v) => !!v.execute);
  const {
    system: clientSystem,
    tools: clientTools = [],
    messages,
    apiKey,
    baseUrl,
    modelName,
    ...callSettings
  } = EdgeRuntimeRequestOptionsSchema.parse(unsafeRequest);
  const systemMessages = [];
  if (serverSystem) systemMessages.push(serverSystem);
  if (clientSystem) systemMessages.push(clientSystem);
  const system = systemMessages.join("\n\n");
  for (const clientTool of clientTools) {
    if (serverTools?.[clientTool.name]) {
      throw new Error(
        `Tool ${clientTool.name} was defined in both the client and server tools. This is not allowed.`
      );
    }
  }
  const model = typeof modelOrCreator === "function" ? await modelOrCreator({ apiKey, baseUrl, modelName }) : modelOrCreator;
  let stream;
  const streamResult = await streamMessage({
    ...settings,
    ...callSettings,
    model,
    abortSignal,
    ...!!system ? { system } : undefined,
    messages: [...messages],
    tools: lmServerTools.concat(clientTools),
    ...toolChoice ? { toolChoice } : undefined
  });
  stream = streamResult.stream;
  const canExecuteTools = hasServerTools && toolChoice?.type !== "none";
  if (canExecuteTools) {
    stream = stream.pipeThrough(toolResultStream(serverTools, abortSignal));
  }
  if (canExecuteTools || onFinish) {
    const tees = stream.tee();
    stream = tees[0];
    let serverStream = tees[1];
    if (onFinish) {
      let lastChunk;
      serverStream = serverStream.pipeThrough(runResultStream()).pipeThrough(
        new TransformStream({
          transform(chunk) {
            lastChunk = chunk;
          },
          flush() {
            if (!lastChunk?.status || lastChunk.status.type === "running")
              return;
            const resultingMessages = [
              ...messages,
              {
                role: "assistant",
                content: lastChunk.content
              }
            ];
            onFinish({
              messages: resultingMessages,
              metadata: {
                // TODO
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                steps: lastChunk.metadata?.steps
              }
            });
          }
        })
      );
    }
    serverStream.pipeTo(voidStream()).catch((e) => {
      console.error("Server stream processing error:", e);
    });
  }
  return stream;
};
var getEdgeRuntimeResponse = async (options) => {
  const stream = await getEdgeRuntimeStream(options);
  return new Response(
    stream.pipeThrough(assistantEncoderStream()).pipeThrough(streamPartEncoderStream()),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    }
  );
};
var createEdgeRuntimeAPI = (options) => ({
  POST: async (request) => getEdgeRuntimeResponse({
    abortSignal: request.signal,
    requestData: await request.json(),
    options
  })
});
async function streamMessage({
  model,
  system,
  messages,
  tools,
  toolChoice,
  ...options
}) {
  return model.doStream({
    inputFormat: "messages",
    mode: {
      type: "regular",
      ...tools ? { tools } : undefined,
      ...toolChoice ? { toolChoice } : undefined
    },
    prompt: convertToLanguageModelPrompt(system, messages),
    ...options
  });
}
function convertToLanguageModelPrompt(system, messages) {
  const languageModelMessages = [];
  if (system != null) {
    languageModelMessages.push({ role: "system", content: system });
  }
  languageModelMessages.push(...toLanguageModelMessages(messages));
  return languageModelMessages;
}

function createContextHook(context, providerName) {
  function useContextHook(options) {
    const contextValue = useContext(context);
    if (!options?.optional && !contextValue) {
      throw new Error(`This component must be used within ${providerName}.`);
    }
    return contextValue;
  }
  return useContextHook;
}

// src/context/react/utils/createContextStoreHook.ts
function createContextStoreHook(contextHook, contextKey) {
  function useStoreStoreHook(options) {
    const context = contextHook(options);
    if (!context) return null;
    return context[contextKey];
  }
  function useStoreHook(param) {
    let optional = false;
    let selector;
    if (typeof param === "function") {
      selector = param;
    } else if (param && typeof param === "object") {
      optional = !!param.optional;
      selector = param.selector;
    }
    const store = useStoreStoreHook({
      optional
    });
    if (!store) return null;
    return selector ? store(selector) : store();
  }
  return {
    [contextKey]: useStoreHook,
    [`${contextKey}Store`]: useStoreStoreHook
  };
}

// src/context/react/utils/ensureBinding.ts
var ensureBinding = (r) => {
  const runtime = r;
  if (runtime.__isBound) return;
  runtime.__internal_bindMethods?.();
  runtime.__isBound = true;
};

// src/context/react/utils/useRuntimeState.ts
function useRuntimeStateInternal(runtime, selector = identity$1) {
  ensureBinding(runtime);
  const slice = useSyncExternalStore(
    runtime.subscribe,
    () => selector(runtime.getState()),
    () => selector(runtime.getState())
  );
  useDebugValue(slice);
  return slice;
}
var identity$1 = (arg) => arg;

// src/context/react/utils/createStateHookForRuntime.ts
function createStateHookForRuntime(useRuntime) {
  function useStoreHook(param) {
    let optional = false;
    let selector;
    if (typeof param === "function") {
      selector = param;
    } else if (param) {
      optional = !!param.optional;
      selector = param.selector;
    }
    const store = useRuntime({ optional });
    if (!store) return null;
    return useRuntimeStateInternal(store, selector);
  }
  return useStoreHook;
}

var AssistantContext = createContext(
  null
);
var useAssistantContext = createContextHook(
  AssistantContext,
  "AssistantRuntimeProvider"
);
function useAssistantRuntime(options) {
  const context = useAssistantContext(options);
  if (!context) return null;
  return context.useAssistantRuntime();
}
var { useToolUIs, useToolUIsStore } = createContextStoreHook(
  useAssistantContext,
  "useToolUIs"
);

const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React__default.useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState())
  );
  React__default.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;

// src/context/stores/AssistantToolUIs.ts
var makeAssistantToolUIsStore = () => create((set) => {
  const renderers = /* @__PURE__ */ new Map();
  return Object.freeze({
    getToolUI: (name) => {
      const arr = renderers.get(name);
      const last = arr?.at(-1);
      if (last) return last;
      return null;
    },
    setToolUI: (name, render) => {
      let arr = renderers.get(name);
      if (!arr) {
        arr = [];
        renderers.set(name, arr);
      }
      arr.push(render);
      set({});
      return () => {
        const index = arr.indexOf(render);
        if (index !== -1) {
          arr.splice(index, 1);
        }
        if (index === arr.length) {
          set({});
        }
      };
    }
  });
});

var ThreadContext = createContext(null);
var useThreadContext = createContextHook(
  ThreadContext,
  "AssistantRuntimeProvider"
);
function useThreadRuntime(options) {
  const context = useThreadContext(options);
  if (!context) return null;
  return context.useThreadRuntime();
}
var useThread = createStateHookForRuntime(useThreadRuntime);
var {
  useViewport: useThreadViewport,
  useViewportStore: useThreadViewportStore
} = createContextStoreHook(useThreadContext, "useViewport");

// src/context/stores/ThreadViewport.tsx
var makeThreadViewportStore = () => {
  const scrollToBottomListeners = /* @__PURE__ */ new Set();
  return create(() => ({
    isAtBottom: true,
    scrollToBottom: () => {
      for (const listener of scrollToBottomListeners) {
        listener();
      }
    },
    onScrollToBottom: (callback) => {
      scrollToBottomListeners.add(callback);
      return () => {
        scrollToBottomListeners.delete(callback);
      };
    }
  }));
};

// src/context/ReadonlyStore.ts
var writableStore = (store) => {
  return store;
};

var ThreadListItemContext = createContext(null);
var useThreadListItemContext = createContextHook(
  ThreadListItemContext,
  "a component passed to <ThreadListPrimitive.Items components={...}>"
);
function useThreadListItemRuntime(options) {
  const context = useThreadListItemContext(options);
  if (!context) return null;
  return context.useThreadListItemRuntime();
}

var useThreadListItemRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var ThreadListItemRuntimeProvider = ({ runtime, children }) => {
  const useThreadListItemRuntime = useThreadListItemRuntimeStore(runtime);
  const [context] = useState(() => {
    return { useThreadListItemRuntime };
  });
  return /* @__PURE__ */ jsx(ThreadListItemContext.Provider, { value: context, children });
};

var useThreadRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    ensureBinding(runtime.composer);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var ThreadRuntimeProvider = ({ children, listItemRuntime: threadListItemRuntime, runtime }) => {
  const useThreadRuntime = useThreadRuntimeStore(runtime);
  const [context] = useState(() => {
    const useViewport = makeThreadViewportStore();
    return {
      useThreadRuntime,
      useViewport
    };
  });
  return /* @__PURE__ */ jsx(ThreadListItemRuntimeProvider, { runtime: threadListItemRuntime, children: /* @__PURE__ */ jsx(ThreadContext.Provider, { value: context, children }) });
};

var useAssistantRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    ensureBinding(runtime.threads);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var useAssistantToolUIsStore = () => {
  return useMemo(() => makeAssistantToolUIsStore(), []);
};
var getRenderComponent = (runtime) => {
  return runtime._core?.RenderComponent;
};
var AssistantRuntimeProviderImpl = ({ children, runtime }) => {
  const useAssistantRuntime = useAssistantRuntimeStore(runtime);
  const useToolUIs = useAssistantToolUIsStore();
  const [context] = useState(() => {
    return {
      useToolUIs,
      useAssistantRuntime
    };
  });
  const RenderComponent = getRenderComponent(runtime);
  return /* @__PURE__ */ jsxs(AssistantContext.Provider, { value: context, children: [
    RenderComponent && /* @__PURE__ */ jsx(RenderComponent, {}),
    /* @__PURE__ */ jsx(
      ThreadRuntimeProvider,
      {
        runtime: runtime.thread,
        listItemRuntime: runtime.threadList.mainItem,
        children
      }
    )
  ] });
};
var AssistantRuntimeProvider = memo(AssistantRuntimeProviderImpl);

var ContentPartContext = createContext(
  null
);
var useContentPartContext = createContextHook(
  ContentPartContext,
  "a component passed to <MessagePrimitive.Content components={...}>"
);
function useContentPartRuntime(options) {
  const context = useContentPartContext(options);
  if (!context) return null;
  return context.useContentPartRuntime();
}
var useContentPart = createStateHookForRuntime(useContentPartRuntime);

// src/api/ContentPartRuntime.ts
var ContentPartRuntimeImpl = class {
  constructor(contentBinding, messageApi, threadApi) {
    this.contentBinding = contentBinding;
    this.messageApi = messageApi;
    this.threadApi = threadApi;
  }
  get path() {
    return this.contentBinding.path;
  }
  __internal_bindMethods() {
    this.addToolResult = this.addToolResult.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this.contentBinding.getState();
  }
  addToolResult(result) {
    const state = this.contentBinding.getState();
    if (!state) throw new Error("Content part is not available");
    if (state.type !== "tool-call")
      throw new Error("Tried to add tool result to non-tool content part");
    if (!this.messageApi)
      throw new Error(
        "Message API is not available. This is likely a bug in assistant-ui."
      );
    if (!this.threadApi) throw new Error("Thread API is not available");
    const message = this.messageApi.getState();
    if (!message) throw new Error("Message is not available");
    const toolName = state.toolName;
    const toolCallId = state.toolCallId;
    this.threadApi.getState().addToolResult({
      messageId: message.id,
      toolName,
      toolCallId,
      result
    });
  }
  subscribe(callback) {
    return this.contentBinding.subscribe(callback);
  }
};

var COMPLETE_STATUS$2 = {
  type: "complete"
};
var RUNNING_STATUS = {
  type: "running"
};
var TextContentPartProvider = ({
  children,
  text,
  isRunning
}) => {
  const [context] = useState(() => {
    const useContentPart = create(() => ({
      status: isRunning ? RUNNING_STATUS : COMPLETE_STATUS$2,
      type: "text",
      text
    }));
    const contentPartRuntime = new ContentPartRuntimeImpl({
      path: {
        ref: "text",
        threadSelector: { type: "main" },
        messageSelector: { type: "messageId", messageId: "" },
        contentPartSelector: { type: "index", index: 0 }
      },
      getState: useContentPart.getState,
      subscribe: useContentPart.subscribe
    });
    ensureBinding(contentPartRuntime);
    const useContentPartRuntime = create(() => contentPartRuntime);
    return { useContentPartRuntime, useContentPart };
  });
  useEffect(() => {
    const state = context.useContentPart.getState();
    const textUpdated = state.text !== text;
    const targetStatus = isRunning ? RUNNING_STATUS : COMPLETE_STATUS$2;
    const statusUpdated = state.status !== targetStatus;
    if (!textUpdated && !statusUpdated) return;
    writableStore(context.useContentPart).setState(
      {
        type: "text",
        text,
        status: targetStatus
      },
      true
    );
  }, [context, isRunning, text]);
  return /* @__PURE__ */ jsx(ContentPartContext.Provider, { value: context, children });
};

var MessageContext = createContext(null);
var useMessageContext = createContextHook(
  MessageContext,
  "a component passed to <ThreadPrimitive.Messages components={...} />"
);
function useMessageRuntime(options) {
  const context = useMessageContext(options);
  if (!context) return null;
  return context.useMessageRuntime();
}
var useMessage = createStateHookForRuntime(useMessageRuntime);
var useEditComposerRuntime = (opt) => useMessageRuntime(opt)?.composer ?? null;
var useEditComposer = createStateHookForRuntime(
  useEditComposerRuntime
);
var { useMessageUtils, useMessageUtilsStore: useMessageUtilsStore$1 } = createContextStoreHook(
  useMessageContext,
  "useMessageUtils"
);

function useComposerRuntime(options) {
  const messageRuntime = useMessageRuntime({ optional: true });
  const threadRuntime = useThreadRuntime(options);
  return messageRuntime ? messageRuntime.composer : threadRuntime?.composer ?? null;
}
var useComposer = createStateHookForRuntime(useComposerRuntime);

var AttachmentContext = createContext(
  null
);
var useAttachmentContext = createContextHook(
  AttachmentContext,
  "a ComposerPrimitive.Attachments or MessagePrimitive.Attachments component"
);
function useAttachmentRuntime(options) {
  const attachmentRuntime = useAttachmentContext(options);
  if (!attachmentRuntime) return null;
  return attachmentRuntime.useAttachmentRuntime();
}
function useThreadComposerAttachmentRuntime(options) {
  const attachmentRuntime = useAttachmentRuntime(options);
  if (!attachmentRuntime) return null;
  if (attachmentRuntime.source !== "thread-composer")
    throw new Error(
      "This component must be used within a thread's ComposerPrimitive.Attachments component."
    );
  return attachmentRuntime;
}
function useMessageAttachmentRuntime(options) {
  const attachmentRuntime = useAttachmentRuntime(options);
  if (!attachmentRuntime) return null;
  if (attachmentRuntime.source !== "message")
    throw new Error(
      "This component must be used within a MessagePrimitive.Attachments component."
    );
  return attachmentRuntime;
}
var useAttachment = createStateHookForRuntime(useAttachmentRuntime);
var useThreadComposerAttachment = createStateHookForRuntime(
  useThreadComposerAttachmentRuntime
);
var useMessageAttachment = createStateHookForRuntime(
  useMessageAttachmentRuntime
);

// packages/react/primitive/src/Primitive.tsx
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = React.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});

var createCombinedStore = (stores) => {
  const subscribe = (callback) => {
    const unsubscribes = stores.map((store) => store.subscribe(callback));
    return () => {
      for (const unsub of unsubscribes) {
        unsub();
      }
    };
  };
  return (selector) => {
    const getSnapshot = () => selector(...stores.map((store) => store.getState()));
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  };
};

var useCombinedStore = (stores, selector) => {
  const useCombined = useMemo(() => createCombinedStore(stores), stores);
  return useCombined(selector);
};

var HideAndFloatStatus = /* @__PURE__ */ ((HideAndFloatStatus2) => {
  HideAndFloatStatus2["Hidden"] = "hidden";
  HideAndFloatStatus2["Floating"] = "floating";
  HideAndFloatStatus2["Normal"] = "normal";
  return HideAndFloatStatus2;
})(HideAndFloatStatus || {});
var useActionBarFloatStatus = ({
  hideWhenRunning,
  autohide,
  autohideFloat
}) => {
  const threadRuntime = useThreadRuntime();
  const messageRuntime = useMessageRuntime();
  const messageUtilsStore = useMessageUtilsStore$1();
  return useCombinedStore(
    [threadRuntime, messageRuntime, messageUtilsStore],
    (t, m, mu) => {
      if (hideWhenRunning && t.isRunning) return "hidden" /* Hidden */;
      const autohideEnabled = autohide === "always" || autohide === "not-last" && !m.isLast;
      if (!autohideEnabled) return "normal" /* Normal */;
      if (!mu.isHovering) return "hidden" /* Hidden */;
      if (autohideFloat === "always" || autohideFloat === "single-branch" && m.branchCount <= 1)
        return "floating" /* Floating */;
      return "normal" /* Normal */;
    }
  );
};

var ActionBarPrimitiveRoot = forwardRef(({ hideWhenRunning, autohide, autohideFloat, ...rest }, ref) => {
  const hideAndfloatStatus = useActionBarFloatStatus({
    hideWhenRunning,
    autohide,
    autohideFloat
  });
  if (hideAndfloatStatus === HideAndFloatStatus.Hidden) return null;
  return /* @__PURE__ */ jsx(
    Primitive.div,
    {
      ...hideAndfloatStatus === HideAndFloatStatus.Floating ? { "data-floating": "true" } : null,
      ...rest,
      ref
    }
  );
});
ActionBarPrimitiveRoot.displayName = "ActionBarPrimitive.Root";

// packages/core/primitive/src/primitive.tsx
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

var useActionBarPrimitiveCopy = ({
  copiedDuration = 3e3
} = {}) => {
  const messageRuntime = useMessageRuntime();
  const composerRuntime = useComposerRuntime();
  const setIsCopied = useMessageUtils((s) => s.setIsCopied);
  const hasCopyableContent = useMessage((message) => {
    return (message.role !== "assistant" || message.status.type !== "running") && message.content.some((c) => c.type === "text" && c.text.length > 0);
  });
  const callback = useCallback(() => {
    const { isEditing, text: composerValue } = composerRuntime.getState();
    const valueToCopy = isEditing ? composerValue : messageRuntime.unstable_getCopyText();
    navigator.clipboard.writeText(valueToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  }, [messageRuntime, setIsCopied, composerRuntime, copiedDuration]);
  if (!hasCopyableContent) return null;
  return callback;
};
var ActionBarPrimitiveCopy = forwardRef(({ copiedDuration, onClick, disabled, ...props }, forwardedRef) => {
  const isCopied = useMessageUtils((u) => u.isCopied);
  const callback = useActionBarPrimitiveCopy({ copiedDuration });
  return /* @__PURE__ */ jsx(
    Primitive.button,
    {
      type: "button",
      ...isCopied ? { "data-copied": "true" } : {},
      ...props,
      ref: forwardedRef,
      disabled: disabled || !callback,
      onClick: composeEventHandlers(onClick, () => {
        callback?.();
      })
    }
  );
});
ActionBarPrimitiveCopy.displayName = "ActionBarPrimitive.Copy";

// src/utils/createActionButton.tsx
var createActionButton = (displayName, useActionButton, forwardProps = []) => {
  const ActionButton = forwardRef((props, forwardedRef) => {
    const forwardedProps = {};
    const primitiveProps = {};
    Object.keys(props).forEach((key) => {
      if (forwardProps.includes(key)) {
        forwardedProps[key] = props[key];
      } else {
        primitiveProps[key] = props[key];
      }
    });
    const callback = useActionButton(forwardedProps) ?? undefined;
    return /* @__PURE__ */ jsx(
      Primitive.button,
      {
        type: "button",
        ...primitiveProps,
        ref: forwardedRef,
        disabled: primitiveProps.disabled || !callback,
        onClick: composeEventHandlers(primitiveProps.onClick, callback)
      }
    );
  });
  ActionButton.displayName = displayName;
  return ActionButton;
};

var useActionBarReload = () => {
  const messageRuntime = useMessageRuntime();
  const threadRuntime = useThreadRuntime();
  const disabled = useCombinedStore(
    [threadRuntime, messageRuntime],
    (t, m) => t.isRunning || t.isDisabled || m.role !== "assistant"
  );
  const callback = useCallback(() => {
    messageRuntime.reload();
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var ActionBarPrimitiveReload = createActionButton(
  "ActionBarPrimitive.Reload",
  useActionBarReload
);

var useActionBarEdit = () => {
  const messageRuntime = useMessageRuntime();
  const disabled = useEditComposer((c) => c.isEditing);
  const callback = useCallback(() => {
    messageRuntime.composer.beginEdit();
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var ActionBarPrimitiveEdit = createActionButton(
  "ActionBarPrimitive.Edit",
  useActionBarEdit
);

var useActionBarSpeak = () => {
  const messageRuntime = useMessageRuntime();
  const callback = useCallback(async () => {
    messageRuntime.speak();
  }, [messageRuntime]);
  const hasSpeakableContent = useMessage((m) => {
    return (m.role !== "assistant" || m.status.type !== "running") && m.content.some((c) => c.type === "text" && c.text.length > 0);
  });
  if (!hasSpeakableContent) return null;
  return callback;
};
var ActionBarPrimitiveSpeak = createActionButton(
  "ActionBarPrimitive.Speak",
  useActionBarSpeak
);

// packages/react/use-callback-ref/src/useCallbackRef.tsx
function useCallbackRef(callback) {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });
  return React.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}

// packages/react/use-escape-keydown/src/useEscapeKeydown.tsx
function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, ownerDocument]);
}

var useActionBarStopSpeaking = () => {
  const messageRuntime = useMessageRuntime();
  const isSpeaking = useMessage((u) => u.speech != null);
  const callback = useCallback(() => {
    messageRuntime.stopSpeaking();
  }, [messageRuntime]);
  if (!isSpeaking) return null;
  return callback;
};
var ActionBarPrimitiveStopSpeaking = forwardRef((props, ref) => {
  const callback = useActionBarStopSpeaking();
  useEscapeKeydown((e) => {
    if (callback) {
      e.preventDefault();
      callback();
    }
  });
  return /* @__PURE__ */ jsx(
    Primitive.button,
    {
      type: "button",
      disabled: !callback,
      ...props,
      ref,
      onClick: composeEventHandlers(props.onClick, () => {
        callback?.();
      })
    }
  );
});
ActionBarPrimitiveStopSpeaking.displayName = "ActionBarPrimitive.StopSpeaking";

var useActionBarFeedbackPositive = () => {
  const messageRuntime = useMessageRuntime();
  const callback = useCallback(() => {
    messageRuntime.submitFeedback({ type: "positive" });
  }, [messageRuntime]);
  return callback;
};
var ActionBarPrimitiveFeedbackPositive = forwardRef(({ onClick, disabled, ...props }, forwardedRef) => {
  const isSubmitted = useMessage(
    (u) => u.submittedFeedback?.type === "positive"
  );
  const callback = useActionBarFeedbackPositive();
  return /* @__PURE__ */ jsx(
    Primitive.button,
    {
      type: "button",
      ...isSubmitted ? { "data-submitted": "true" } : {},
      ...props,
      ref: forwardedRef,
      disabled: disabled || !callback,
      onClick: composeEventHandlers(onClick, () => {
        callback?.();
      })
    }
  );
});
ActionBarPrimitiveFeedbackPositive.displayName = "ActionBarPrimitive.FeedbackPositive";

var useActionBarFeedbackNegative = () => {
  const messageRuntime = useMessageRuntime();
  const callback = useCallback(() => {
    messageRuntime.submitFeedback({ type: "negative" });
  }, [messageRuntime]);
  return callback;
};
var ActionBarPrimitiveFeedbackNegative = forwardRef(({ onClick, disabled, ...props }, forwardedRef) => {
  const isSubmitted = useMessage(
    (u) => u.submittedFeedback?.type === "negative"
  );
  const callback = useActionBarFeedbackNegative();
  return /* @__PURE__ */ jsx(
    Primitive.button,
    {
      type: "button",
      ...isSubmitted ? { "data-submitted": "true" } : {},
      ...props,
      ref: forwardedRef,
      disabled: disabled || !callback,
      onClick: composeEventHandlers(onClick, () => {
        callback?.();
      })
    }
  );
});
ActionBarPrimitiveFeedbackNegative.displayName = "ActionBarPrimitive.FeedbackNegative";

// src/primitives/assistantModal/scope.tsx
var usePopoverScope = PopoverPrimitive.createPopoverScope();

var useAssistantModalOpenState = ({
  defaultOpen = false,
  unstable_openOnRunStart = true
}) => {
  const state = useState(defaultOpen);
  const [, setOpen] = state;
  const threadRuntime = useThreadRuntime();
  useEffect(() => {
    if (!unstable_openOnRunStart) return undefined;
    return threadRuntime.unstable_on("run-start", () => {
      setOpen(true);
    });
  }, [unstable_openOnRunStart]);
  return state;
};
var AssistantModalPrimitiveRoot = ({
  __scopeAssistantModal,
  defaultOpen,
  unstable_openOnRunStart,
  open,
  onOpenChange,
  ...rest
}) => {
  const scope = usePopoverScope(__scopeAssistantModal);
  const [modalOpen, setOpen] = useAssistantModalOpenState({
    defaultOpen,
    unstable_openOnRunStart
  });
  return /* @__PURE__ */ jsx(
    PopoverPrimitive.Root,
    {
      ...scope,
      open: open === undefined ? modalOpen : open,
      onOpenChange: composeEventHandlers(onOpenChange, setOpen),
      ...rest
    }
  );
};
AssistantModalPrimitiveRoot.displayName = "AssistantModalPrimitive.Root";

// src/primitives/assistantModal/AssistantModalTrigger.tsx
var AssistantModalPrimitiveTrigger = forwardRef(
  ({
    __scopeAssistantModal,
    ...rest
  }, ref) => {
    const scope = usePopoverScope(__scopeAssistantModal);
    return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { ...scope, ...rest, ref });
  }
);
AssistantModalPrimitiveTrigger.displayName = "AssistantModalPrimitive.Trigger";

var AssistantModalPrimitiveContent = forwardRef(
  ({
    __scopeAssistantModal,
    side,
    align,
    onInteractOutside,
    dissmissOnInteractOutside = false,
    ...props
  }, forwardedRef) => {
    const scope = usePopoverScope(__scopeAssistantModal);
    return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { ...scope, children: /* @__PURE__ */ jsx(
      PopoverPrimitive.Content,
      {
        ...scope,
        ...props,
        ref: forwardedRef,
        side: side ?? "top",
        align: align ?? "end",
        onInteractOutside: composeEventHandlers(
          onInteractOutside,
          dissmissOnInteractOutside ? undefined : (e) => e.preventDefault()
        )
      }
    ) });
  }
);
AssistantModalPrimitiveContent.displayName = "AssistantModalPrimitive.Content";

var AssistantModalPrimitiveAnchor = forwardRef(
  ({
    __scopeAssistantModal,
    ...rest
  }, ref) => {
    const scope = usePopoverScope(__scopeAssistantModal);
    return /* @__PURE__ */ jsx(PopoverPrimitive.Anchor, { ...scope, ...rest, ref });
  }
);
AssistantModalPrimitiveAnchor.displayName = "AssistantModalPrimitive.Anchor";

// src/primitives/attachment/AttachmentRoot.tsx
var AttachmentPrimitiveRoot = forwardRef((props, ref) => {
  return /* @__PURE__ */ jsx(Primitive.div, { ...props, ref });
});
AttachmentPrimitiveRoot.displayName = "AttachmentPrimitive.Root";

var AttachmentPrimitiveName = () => {
  const name = useAttachment((a) => a.name);
  return /* @__PURE__ */ jsx(Fragment, { children: name });
};
AttachmentPrimitiveName.displayName = "AttachmentPrimitive.Name";

var useAttachmentRemove = () => {
  const attachmentRuntime = useAttachmentRuntime();
  const handleRemoveAttachment = useCallback(() => {
    attachmentRuntime.remove();
  }, [attachmentRuntime]);
  return handleRemoveAttachment;
};
var AttachmentPrimitiveRemove = createActionButton(
  "AttachmentPrimitive.Remove",
  useAttachmentRemove
);

var useBranchPickerNext = () => {
  const messageRuntime = useMessageRuntime();
  const disabled = useMessage((m) => m.branchNumber >= m.branchCount);
  const callback = useCallback(() => {
    messageRuntime.switchToBranch({ position: "next" });
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var BranchPickerPrimitiveNext = createActionButton(
  "BranchPickerPrimitive.Next",
  useBranchPickerNext
);

var useBranchPickerPrevious = () => {
  const messageRuntime = useMessageRuntime();
  const disabled = useMessage((m) => m.branchNumber <= 1);
  const callback = useCallback(() => {
    messageRuntime.switchToBranch({ position: "previous" });
  }, [messageRuntime]);
  if (disabled) return null;
  return callback;
};
var BranchPickerPrimitivePrevious = createActionButton(
  "BranchPickerPrimitive.Previous",
  useBranchPickerPrevious
);

var useBranchPickerCount = () => {
  const branchCount = useMessage((s) => s.branchCount);
  return branchCount;
};
var BranchPickerPrimitiveCount = () => {
  const branchCount = useBranchPickerCount();
  return /* @__PURE__ */ jsx(Fragment, { children: branchCount });
};
BranchPickerPrimitiveCount.displayName = "BranchPickerPrimitive.Count";

var useBranchPickerNumber = () => {
  const branchNumber = useMessage((s) => s.branchNumber);
  return branchNumber;
};
var BranchPickerPrimitiveNumber = () => {
  const branchNumber = useBranchPickerNumber();
  return /* @__PURE__ */ jsx(Fragment, { children: branchNumber });
};
BranchPickerPrimitiveNumber.displayName = "BranchPickerPrimitive.Number";

// src/utils/hooks/useManagedRef.ts
var useManagedRef = (callback) => {
  const cleanupRef = useRef(undefined);
  const ref = useCallback(
    (el) => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (el) {
        cleanupRef.current = callback(el);
      }
    },
    [callback]
  );
  return ref;
};

// packages/react/compose-refs/src/composeRefs.tsx
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}

var useIsHoveringRef = () => {
  const messageUtilsStore = useMessageUtilsStore$1();
  const callbackRef = useCallback(
    (el) => {
      const setIsHovering = messageUtilsStore.getState().setIsHovering;
      const handleMouseEnter = () => {
        setIsHovering(true);
      };
      const handleMouseLeave = () => {
        setIsHovering(false);
      };
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        setIsHovering(false);
      };
    },
    [messageUtilsStore]
  );
  return useManagedRef(callbackRef);
};
var MessagePrimitiveRoot = forwardRef((props, forwardRef2) => {
  const isHoveringRef = useIsHoveringRef();
  const ref = useComposedRefs(forwardRef2, isHoveringRef);
  return /* @__PURE__ */ jsx(Primitive.div, { ...props, ref });
});
MessagePrimitiveRoot.displayName = "MessagePrimitive.Root";

var useMessageIf = (props) => {
  const messageRuntime = useMessageRuntime();
  const messageUtilsStore = useMessageUtilsStore$1();
  return useCombinedStore(
    [messageRuntime, messageUtilsStore],
    ({
      role,
      attachments,
      content,
      branchCount,
      isLast,
      speech,
      submittedFeedback
    }, { isCopied, isHovering }) => {
      if (props.hasBranches === true && branchCount < 2) return false;
      if (props.user && role !== "user") return false;
      if (props.assistant && role !== "assistant") return false;
      if (props.system && role !== "system") return false;
      if (props.lastOrHover === true && !isHovering && !isLast) return false;
      if (props.copied === true && !isCopied) return false;
      if (props.copied === false && isCopied) return false;
      if (props.speaking === true && speech == null) return false;
      if (props.speaking === false && speech != null) return false;
      if (props.hasAttachments === true && (role !== "user" || !attachments.length))
        return false;
      if (props.hasAttachments === false && role === "user" && !!attachments.length)
        return false;
      if (props.hasContent === true && content.length === 0) return false;
      if (props.hasContent === false && content.length > 0) return false;
      if (props.submittedFeedback !== undefined && (submittedFeedback?.type ?? null) !== props.submittedFeedback)
        return false;
      return true;
    }
  );
};
var MessagePrimitiveIf = ({
  children,
  ...query
}) => {
  const result = useMessageIf(query);
  return result ? children : null;
};
MessagePrimitiveIf.displayName = "MessagePrimitive.If";

var useContentPartRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var ContentPartRuntimeProvider = ({ runtime, children }) => {
  const useContentPartRuntime = useContentPartRuntimeStore(runtime);
  const [context] = useState(() => {
    return { useContentPartRuntime };
  });
  return /* @__PURE__ */ jsx(ContentPartContext.Provider, { value: context, children });
};

var useContentPartText = () => {
  const text = useContentPart((c) => {
    if (c.type !== "text")
      throw new Error(
        "ContentPartText can only be used inside text content parts."
      );
    return c;
  });
  return text;
};

var SmoothContext = createContext(null);
var makeSmoothContext = (initialState) => {
  const useSmoothStatus2 = create(() => initialState);
  return { useSmoothStatus: useSmoothStatus2 };
};
var SmoothContextProvider = ({ children }) => {
  const outer = useSmoothContext({ optional: true });
  const contentPartRuntime = useContentPartRuntime();
  const [context] = useState(
    () => makeSmoothContext(contentPartRuntime.getState().status)
  );
  if (outer) return children;
  return /* @__PURE__ */ jsx(SmoothContext.Provider, { value: context, children });
};
var withSmoothContextProvider = (Component) => {
  const Wrapped = forwardRef((props, ref) => {
    return /* @__PURE__ */ jsx(SmoothContextProvider, { children: /* @__PURE__ */ jsx(Component, { ...props, ref }) });
  });
  Wrapped.displayName = Component.displayName;
  return Wrapped;
};
function useSmoothContext(options) {
  const context = useContext(SmoothContext);
  if (!options?.optional && !context)
    throw new Error(
      "This component must be used within a SmoothContextProvider."
    );
  return context;
}
var { useSmoothStatus, useSmoothStatusStore } = createContextStoreHook(
  useSmoothContext,
  "useSmoothStatus"
);

var TextStreamAnimator = class {
  constructor(currentText, setText) {
    this.currentText = currentText;
    this.setText = setText;
  }
  animationFrameId = null;
  lastUpdateTime = Date.now();
  targetText = "";
  start() {
    if (this.animationFrameId !== null) return;
    this.lastUpdateTime = Date.now();
    this.animate();
  }
  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  animate = () => {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    let timeToConsume = deltaTime;
    const remainingChars = this.targetText.length - this.currentText.length;
    const baseTimePerChar = Math.min(5, 250 / remainingChars);
    let charsToAdd = 0;
    while (timeToConsume >= baseTimePerChar && charsToAdd < remainingChars) {
      charsToAdd++;
      timeToConsume -= baseTimePerChar;
    }
    if (charsToAdd !== remainingChars) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    } else {
      this.animationFrameId = null;
    }
    if (charsToAdd === 0) return;
    this.currentText = this.targetText.slice(
      0,
      this.currentText.length + charsToAdd
    );
    this.lastUpdateTime = currentTime - timeToConsume;
    this.setText(this.currentText);
  };
};
var SMOOTH_STATUS = Object.freeze({
  type: "running"
});
var useSmooth = (state, smooth = false) => {
  const { text } = state;
  const id = useMessage({
    optional: true,
    selector: (m) => m.id
  });
  const idRef = useRef(id);
  const [displayedText, setDisplayedText] = useState(text);
  const smoothStatusStore = useSmoothStatusStore({ optional: true });
  const setText = useCallbackRef((text2) => {
    setDisplayedText(text2);
    if (smoothStatusStore) {
      writableStore(smoothStatusStore).setState(
        text2 !== state.text ? SMOOTH_STATUS : state.status
      );
    }
  });
  useEffect(() => {
    if (smoothStatusStore) {
      writableStore(smoothStatusStore).setState(
        text !== state.text ? SMOOTH_STATUS : state.status
      );
    }
  }, [smoothStatusStore, text, displayedText, state.status, state.text]);
  const [animatorRef] = useState(
    new TextStreamAnimator(text, setText)
  );
  useEffect(() => {
    if (!smooth) {
      animatorRef.stop();
      return;
    }
    if (idRef.current !== id || !text.startsWith(animatorRef.targetText)) {
      idRef.current = id;
      setText(text);
      animatorRef.currentText = text;
      animatorRef.targetText = text;
      animatorRef.stop();
      return;
    }
    animatorRef.targetText = text;
    animatorRef.start();
  }, [setText, animatorRef, id, smooth, text]);
  useEffect(() => {
    return () => {
      animatorRef.stop();
    };
  }, [animatorRef]);
  return useMemo(
    () => smooth ? {
      type: "text",
      text: displayedText,
      status: text === displayedText ? state.status : SMOOTH_STATUS
    } : state,
    [smooth, displayedText, state, text]
  );
};

var ContentPartPrimitiveText = forwardRef(({ smooth = true, component: Component = "span", ...rest }, forwardedRef) => {
  const { text, status } = useSmooth(useContentPartText(), smooth);
  return /* @__PURE__ */ jsx(Component, { "data-status": status.type, ...rest, ref: forwardedRef, children: text });
});
ContentPartPrimitiveText.displayName = "ContentPartPrimitive.Text";

var useContentPartImage = () => {
  const image = useContentPart((c) => {
    if (c.type !== "image")
      throw new Error(
        "ContentPartImage can only be used inside image content parts."
      );
    return c;
  });
  return image;
};

var ContentPartPrimitiveImage = forwardRef((props, forwardedRef) => {
  const { image } = useContentPartImage();
  return /* @__PURE__ */ jsx(Primitive.img, { src: image, ...props, ref: forwardedRef });
});
ContentPartPrimitiveImage.displayName = "ContentPartPrimitive.Image";

var useContentPartDisplay = () => {
  const display = useContentPart((c) => {
    if (c.type !== "ui")
      throw new Error(
        "This component can only be used inside ui content parts."
      );
    return c;
  });
  return display;
};

var ContentPartPrimitiveDisplay = () => {
  const { display } = useContentPartDisplay();
  return display ?? null;
};
ContentPartPrimitiveDisplay.displayName = "ContentPartPrimitive.Display";

var ContentPartPrimitiveInProgress = ({ children }) => {
  const isInProgress = useContentPart((c) => c.status.type === "running");
  return isInProgress ? children : null;
};
ContentPartPrimitiveInProgress.displayName = "ContentPartPrimitive.InProgress";

var ToolUIDisplay = ({
  Fallback,
  ...props
}) => {
  const Render = useToolUIs((s) => s.getToolUI(props.toolName)) ?? Fallback;
  if (!Render) return null;
  return /* @__PURE__ */ jsx(Render, { ...props });
};
var defaultComponents = {
  Text: () => /* @__PURE__ */ jsxs("p", { style: { whiteSpace: "pre-line" }, children: [
    /* @__PURE__ */ jsx(ContentPartPrimitiveText, {}),
    /* @__PURE__ */ jsx(ContentPartPrimitiveInProgress, { children: /* @__PURE__ */ jsx("span", { style: { fontFamily: "revert" }, children: " \u25CF" }) })
  ] }),
  Image: () => /* @__PURE__ */ jsx(ContentPartPrimitiveImage, {}),
  File: () => null,
  Unstable_Audio: () => null,
  UI: () => /* @__PURE__ */ jsx(ContentPartPrimitiveDisplay, {})
};
var MessageContentPartComponent = ({
  components: {
    Text = defaultComponents.Text,
    Image = defaultComponents.Image,
    File = defaultComponents.File,
    Unstable_Audio: Audio = defaultComponents.Unstable_Audio,
    UI = defaultComponents.UI,
    tools = {}
  } = {}
}) => {
  const contentPartRuntime = useContentPartRuntime();
  const part = useContentPart();
  const type = part.type;
  if (type === "tool-call") {
    const addResult = (result) => contentPartRuntime.addToolResult(result);
    if ("Override" in tools)
      return /* @__PURE__ */ jsx(tools.Override, { ...part, addResult });
    const Tool = tools.by_name?.[part.toolName] ?? tools.Fallback;
    return /* @__PURE__ */ jsx(ToolUIDisplay, { ...part, Fallback: Tool, addResult });
  }
  if (part.status.type === "requires-action")
    throw new Error("Encountered unexpected requires-action status");
  switch (type) {
    case "text":
      return /* @__PURE__ */ jsx(Text, { ...part });
    case "image":
      return /* @__PURE__ */ jsx(Image, { ...part });
    case "file":
      return /* @__PURE__ */ jsx(File, { ...part });
    case "audio":
      return /* @__PURE__ */ jsx(Audio, { ...part });
    case "ui":
      return /* @__PURE__ */ jsx(UI, { ...part });
    default:
      const unhandledType = type;
      throw new Error(`Unknown content part type: ${unhandledType}`);
  }
};
var MessageContentPartImpl = ({
  partIndex,
  components
}) => {
  const messageRuntime = useMessageRuntime();
  const runtime = useMemo(
    () => messageRuntime.getContentPartByIndex(partIndex),
    [messageRuntime, partIndex]
  );
  return /* @__PURE__ */ jsx(ContentPartRuntimeProvider, { runtime, children: /* @__PURE__ */ jsx(MessageContentPartComponent, { components }) });
};
var MessageContentPart = memo(
  MessageContentPartImpl,
  (prev, next) => prev.partIndex === next.partIndex && prev.components?.Text === next.components?.Text && prev.components?.Image === next.components?.Image && prev.components?.File === next.components?.File && prev.components?.Unstable_Audio === next.components?.Unstable_Audio && prev.components?.UI === next.components?.UI && prev.components?.tools === next.components?.tools
);
var COMPLETE_STATUS$1 = Object.freeze({
  type: "complete"
});
var EmptyContentFallback = ({ status, component: Component }) => {
  return /* @__PURE__ */ jsx(TextContentPartProvider, { text: "", isRunning: status.type === "running", children: /* @__PURE__ */ jsx(Component, { type: "text", text: "", status }) });
};
var EmptyContentImpl = ({
  components
}) => {
  const status = useMessage((s) => s.status) ?? COMPLETE_STATUS$1;
  if (components?.Empty) return /* @__PURE__ */ jsx(components.Empty, { status });
  return /* @__PURE__ */ jsx(
    EmptyContentFallback,
    {
      status,
      component: components?.Text ?? defaultComponents.Text
    }
  );
};
var EmptyContent = memo(
  EmptyContentImpl,
  (prev, next) => prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text
);
var MessagePrimitiveContent = ({
  components
}) => {
  const contentLength = useMessage((s) => s.content.length);
  if (contentLength === 0) {
    return /* @__PURE__ */ jsx(EmptyContent, { components });
  }
  return Array.from({ length: contentLength }, (_, index) => /* @__PURE__ */ jsx(MessageContentPart, { partIndex: index, components }, index));
};
MessagePrimitiveContent.displayName = "MessagePrimitive.Content";

var useAttachmentRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var AttachmentRuntimeProvider = ({
  runtime,
  children
}) => {
  const useAttachmentRuntime = useAttachmentRuntimeStore(runtime);
  const [context] = useState(() => {
    return {
      useAttachmentRuntime
    };
  });
  return /* @__PURE__ */ jsx(AttachmentContext.Provider, { value: context, children });
};

var getComponent$2 = (components, attachment) => {
  const type = attachment.type;
  switch (type) {
    case "image":
      return components?.Image ?? components?.Attachment;
    case "document":
      return components?.Document ?? components?.Attachment;
    case "file":
      return components?.File ?? components?.Attachment;
    default:
      const _exhaustiveCheck = type;
      throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
  }
};
var AttachmentComponent$1 = ({ components }) => {
  const Component = useMessageAttachment((a) => getComponent$2(components, a));
  if (!Component) return null;
  return /* @__PURE__ */ jsx(Component, {});
};
var MessageAttachmentImpl = ({ components, attachmentIndex }) => {
  const messageRuntime = useMessageRuntime();
  const runtime = useMemo(
    () => messageRuntime.getAttachmentByIndex(attachmentIndex),
    [messageRuntime, attachmentIndex]
  );
  return /* @__PURE__ */ jsx(AttachmentRuntimeProvider, { runtime, children: /* @__PURE__ */ jsx(AttachmentComponent$1, { components }) });
};
var MessageAttachment = memo(
  MessageAttachmentImpl,
  (prev, next) => prev.attachmentIndex === next.attachmentIndex && prev.components?.Image === next.components?.Image && prev.components?.Document === next.components?.Document && prev.components?.File === next.components?.File && prev.components?.Attachment === next.components?.Attachment
);
var MessagePrimitiveAttachments = ({ components }) => {
  const attachmentsCount = useMessage((message) => {
    if (message.role !== "user") return 0;
    return message.attachments.length;
  });
  return Array.from({ length: attachmentsCount }, (_, index) => /* @__PURE__ */ jsx(
    MessageAttachment,
    {
      attachmentIndex: index,
      components
    },
    index
  ));
};
MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";

// src/primitives/branchPicker/BranchPickerRoot.tsx
var BranchPickerPrimitiveRoot = forwardRef(({ hideWhenSingleBranch, ...rest }, ref) => {
  return /* @__PURE__ */ jsx(MessagePrimitiveIf, { hasBranches: hideWhenSingleBranch ? true : undefined, children: /* @__PURE__ */ jsx(Primitive.div, { ...rest, ref }) });
});
BranchPickerPrimitiveRoot.displayName = "BranchPickerPrimitive.Root";

var useComposerSend = () => {
  const composerRuntime = useComposerRuntime();
  const threadRuntime = useThreadRuntime();
  const disabled = useCombinedStore(
    [threadRuntime, composerRuntime],
    (t, c) => t.isRunning || !c.isEditing || c.isEmpty
  );
  const callback = useCallback(() => {
    composerRuntime.send();
  }, [composerRuntime]);
  if (disabled) return null;
  return callback;
};
var ComposerPrimitiveSend = createActionButton(
  "ComposerPrimitive.Send",
  useComposerSend
);

var ComposerPrimitiveRoot = forwardRef(({ onSubmit, ...rest }, forwardedRef) => {
  const send = useComposerSend();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!send) return;
    send();
  };
  return /* @__PURE__ */ jsx(
    Primitive.form,
    {
      ...rest,
      ref: forwardedRef,
      onSubmit: composeEventHandlers(onSubmit, handleSubmit)
    }
  );
});
ComposerPrimitiveRoot.displayName = "ComposerPrimitive.Root";

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

// basically Exclude<React.ClassAttributes<T>["ref"], string>

var updateRef = function updateRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
};
var useComposedRef = function useComposedRef(libRef, userRef) {
  var prevUserRef = React__default.useRef();
  return React__default.useCallback(function (instance) {
    libRef.current = instance;
    if (prevUserRef.current) {
      updateRef(prevUserRef.current, null);
    }
    prevUserRef.current = userRef;
    if (!userRef) {
      return;
    }
    updateRef(userRef, instance);
  }, [userRef]);
};

var noop = function noop() {};

var _excluded = ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"];
var TextareaAutosize = function TextareaAutosize(_ref, userRef) {
  _ref.cacheMeasurements;
    _ref.maxRows;
    _ref.minRows;
    var _ref$onChange = _ref.onChange,
    onChange = _ref$onChange === undefined ? noop : _ref$onChange;
    _ref.onHeightChange;
    var props = _objectWithoutPropertiesLoose(_ref, _excluded);
  props.value !== undefined;
  var libRef = React.useRef(null);
  var ref = useComposedRef(libRef, userRef);
  React.useRef(0);
  React.useRef();
  return /*#__PURE__*/React.createElement("textarea", _extends({}, props, {
    onChange: onChange,
    ref: ref
  }));
};
var index = /* #__PURE__ */React.forwardRef(TextareaAutosize);

var useOnScrollToBottom = (callback) => {
  const callbackRef = useCallbackRef(callback);
  const onScrollToBottom = useThreadViewport((vp) => vp.onScrollToBottom);
  useEffect(() => {
    return onScrollToBottom(callbackRef);
  }, [onScrollToBottom, callbackRef]);
};

var ComposerPrimitiveInput = forwardRef(
  ({
    autoFocus = false,
    asChild,
    disabled: disabledProp,
    onChange,
    onKeyDown,
    submitOnEnter = true,
    cancelOnEscape = true,
    unstable_focusOnRunStart = true,
    unstable_focusOnScrollToBottom = true,
    unstable_focusOnThreadSwitched = true,
    ...rest
  }, forwardedRef) => {
    const threadListItemRuntime = useThreadListItemRuntime();
    const threadRuntime = useThreadRuntime();
    const composerRuntime = useComposerRuntime();
    const value = useComposer((c) => {
      if (!c.isEditing) return "";
      return c.text;
    });
    const Component = asChild ? Slot : index;
    const isDisabled = useThread((t) => t.isDisabled) ?? disabledProp ?? false;
    const textareaRef = useRef(null);
    const ref = useComposedRefs(forwardedRef, textareaRef);
    useEscapeKeydown((e) => {
      if (!cancelOnEscape) return;
      if (composerRuntime.getState().canCancel) {
        composerRuntime.cancel();
        e.preventDefault();
      }
    });
    const handleKeyPress = (e) => {
      if (isDisabled || !submitOnEnter) return;
      if (e.nativeEvent.isComposing) return;
      if (e.key === "Enter" && e.shiftKey === false) {
        const { isRunning } = threadRuntime.getState();
        if (!isRunning) {
          e.preventDefault();
          textareaRef.current?.closest("form")?.requestSubmit();
        }
      }
    };
    const autoFocusEnabled = autoFocus && !isDisabled;
    const focus = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoFocusEnabled) return;
      textarea.focus({ preventScroll: true });
      textarea.setSelectionRange(
        textarea.value.length,
        textarea.value.length
      );
    }, [autoFocusEnabled]);
    useEffect(() => focus(), [focus]);
    useOnScrollToBottom(() => {
      if (composerRuntime.type === "thread" && unstable_focusOnScrollToBottom) {
        focus();
      }
    });
    useEffect(() => {
      if (composerRuntime.type !== "thread" || !unstable_focusOnRunStart)
        return undefined;
      return threadRuntime.unstable_on("run-start", focus);
    }, [unstable_focusOnRunStart]);
    useEffect(() => {
      if (composerRuntime.type !== "thread" || !unstable_focusOnThreadSwitched)
        return undefined;
      return threadListItemRuntime.unstable_on("switched-to", focus);
    }, [unstable_focusOnThreadSwitched]);
    return /* @__PURE__ */ jsx(
      Component,
      {
        name: "input",
        value,
        ...rest,
        ref,
        disabled: isDisabled,
        onChange: composeEventHandlers(onChange, (e) => {
          if (!composerRuntime.getState().isEditing) return;
          return composerRuntime.setText(e.target.value);
        }),
        onKeyDown: composeEventHandlers(onKeyDown, handleKeyPress)
      }
    );
  }
);
ComposerPrimitiveInput.displayName = "ComposerPrimitive.Input";

var useComposerCancel = () => {
  const composerRuntime = useComposerRuntime();
  const disabled = useComposer((c) => !c.canCancel);
  const callback = useCallback(() => {
    composerRuntime.cancel();
  }, [composerRuntime]);
  if (disabled) return null;
  return callback;
};
var ComposerPrimitiveCancel = createActionButton(
  "ComposerPrimitive.Cancel",
  useComposerCancel
);

var useComposerAddAttachment = ({
  multiple = true
} = {}) => {
  const disabled = useComposer((c) => !c.isEditing);
  const composerRuntime = useComposerRuntime();
  const callback = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    const attachmentAccept = composerRuntime.getAttachmentAccept();
    if (attachmentAccept !== "*") {
      input.accept = attachmentAccept;
    }
    input.onchange = (e) => {
      const fileList = e.target.files;
      if (!fileList) return;
      for (const file of fileList) {
        composerRuntime.addAttachment(file);
      }
    };
    input.click();
  }, [composerRuntime, multiple]);
  if (disabled) return null;
  return callback;
};
var ComposerPrimitiveAddAttachment = createActionButton(
  "ComposerPrimitive.AddAttachment",
  useComposerAddAttachment,
  ["multiple"]
);

var getComponent$1 = (components, attachment) => {
  const type = attachment.type;
  switch (type) {
    case "image":
      return components?.Image ?? components?.Attachment;
    case "document":
      return components?.Document ?? components?.Attachment;
    case "file":
      return components?.File ?? components?.Attachment;
    default:
      const _exhaustiveCheck = type;
      throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
  }
};
var AttachmentComponent = ({ components }) => {
  const Component = useThreadComposerAttachment(
    (a) => getComponent$1(components, a)
  );
  if (!Component) return null;
  return /* @__PURE__ */ jsx(Component, {});
};
var ComposerAttachmentImpl = ({ components, attachmentIndex }) => {
  const composerRuntime = useComposerRuntime();
  const runtime = useMemo(
    () => composerRuntime.getAttachmentByIndex(attachmentIndex),
    [composerRuntime, attachmentIndex]
  );
  return /* @__PURE__ */ jsx(AttachmentRuntimeProvider, { runtime, children: /* @__PURE__ */ jsx(AttachmentComponent, { components }) });
};
var ComposerAttachment = memo(
  ComposerAttachmentImpl,
  (prev, next) => prev.attachmentIndex === next.attachmentIndex && prev.components?.Image === next.components?.Image && prev.components?.Document === next.components?.Document && prev.components?.File === next.components?.File && prev.components?.Attachment === next.components?.Attachment
);
var ComposerPrimitiveAttachments = ({ components }) => {
  const attachmentsCount = useComposer((s) => s.attachments.length);
  return Array.from({ length: attachmentsCount }, (_, index) => /* @__PURE__ */ jsx(
    ComposerAttachment,
    {
      attachmentIndex: index,
      components
    },
    index
  ));
};
ComposerPrimitiveAttachments.displayName = "ComposerPrimitive.Attachments";

// src/primitives/thread/ThreadRoot.tsx
var ThreadPrimitiveRoot = forwardRef((props, ref) => {
  return /* @__PURE__ */ jsx(Primitive.div, { ...props, ref });
});
ThreadPrimitiveRoot.displayName = "ThreadPrimitive.Root";

var ThreadPrimitiveEmpty = ({
  children
}) => {
  const empty = useThread((u) => u.messages.length === 0);
  return empty ? children : null;
};
ThreadPrimitiveEmpty.displayName = "ThreadPrimitive.Empty";

var useThreadIf = (props) => {
  return useThread((thread) => {
    if (props.empty === true && thread.messages.length !== 0) return false;
    if (props.empty === false && thread.messages.length === 0) return false;
    if (props.running === true && !thread.isRunning) return false;
    if (props.running === false && thread.isRunning) return false;
    if (props.disabled === true && !thread.isDisabled) return false;
    if (props.disabled === false && thread.isDisabled) return false;
    return true;
  });
};
var ThreadPrimitiveIf = ({
  children,
  ...query
}) => {
  const result = useThreadIf(query);
  return result ? children : null;
};
ThreadPrimitiveIf.displayName = "ThreadPrimitive.If";

// src/utils/hooks/useOnResizeContent.tsx
var useOnResizeContent = (callback) => {
  const callbackRef = useCallbackRef(callback);
  const refCallback = useCallback(
    (el) => {
      const resizeObserver = new ResizeObserver(() => {
        callbackRef();
      });
      const mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              resizeObserver.observe(node);
            }
          }
          for (const node of mutation.removedNodes) {
            if (node instanceof Element) {
              resizeObserver.unobserve(node);
            }
          }
        }
        callbackRef();
      });
      resizeObserver.observe(el);
      mutationObserver.observe(el, { childList: true });
      for (const child of el.children) {
        resizeObserver.observe(child);
      }
      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    },
    [callbackRef]
  );
  return useManagedRef(refCallback);
};

var useThreadViewportAutoScroll = ({
  autoScroll = true,
  unstable_scrollToBottomOnRunStart = true
}) => {
  const divRef = useRef(null);
  const threadViewportStore = useThreadViewportStore();
  const lastScrollTop = useRef(0);
  const isScrollingToBottomRef = useRef(false);
  const scrollToBottom = (behavior) => {
    const div = divRef.current;
    if (!div || !autoScroll) return;
    isScrollingToBottomRef.current = true;
    div.scrollTo({ top: div.scrollHeight, behavior });
  };
  const handleScroll = () => {
    const div = divRef.current;
    if (!div) return;
    const isAtBottom = threadViewportStore.getState().isAtBottom;
    const newIsAtBottom = div.scrollHeight - div.scrollTop <= div.clientHeight + 1;
    if (!newIsAtBottom && lastScrollTop.current < div.scrollTop) ; else {
      if (newIsAtBottom) {
        isScrollingToBottomRef.current = false;
      }
      if (newIsAtBottom !== isAtBottom) {
        writableStore(threadViewportStore).setState({
          isAtBottom: newIsAtBottom
        });
      }
    }
    lastScrollTop.current = div.scrollTop;
  };
  const resizeRef = useOnResizeContent(() => {
    if (isScrollingToBottomRef.current || threadViewportStore.getState().isAtBottom) {
      scrollToBottom("instant");
    }
    handleScroll();
  });
  const scrollRef = useManagedRef((el) => {
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  });
  const autoScrollRef = useComposedRefs(resizeRef, scrollRef, divRef);
  useOnScrollToBottom(() => {
    scrollToBottom("auto");
  });
  const threadRuntime = useThreadRuntime();
  useEffect(() => {
    if (!unstable_scrollToBottomOnRunStart) return undefined;
    return threadRuntime.unstable_on("run-start", focus);
  }, [unstable_scrollToBottomOnRunStart]);
  return autoScrollRef;
};

var ThreadPrimitiveViewport = forwardRef(({ autoScroll, children, ...rest }, forwardedRef) => {
  const autoScrollRef = useThreadViewportAutoScroll({
    autoScroll
  });
  const ref = useComposedRefs(forwardedRef, autoScrollRef);
  return /* @__PURE__ */ jsx(Primitive.div, { ...rest, ref, children });
});
ThreadPrimitiveViewport.displayName = "ThreadPrimitive.Viewport";

// src/context/stores/MessageUtils.ts
var makeMessageUtilsStore = () => create((set) => {
  return {
    isCopied: false,
    setIsCopied: (value) => {
      set({ isCopied: value });
    },
    isHovering: false,
    setIsHovering: (value) => {
      set({ isHovering: value });
    }
  };
});

var useMessageRuntimeStore = (runtime) => {
  const [store] = useState(() => create(() => runtime));
  useEffect(() => {
    ensureBinding(runtime);
    writableStore(store).setState(runtime, true);
  }, [runtime, store]);
  return store;
};
var useMessageUtilsStore = () => {
  const [store] = useState(() => makeMessageUtilsStore());
  return store;
};
var MessageRuntimeProvider = ({
  runtime,
  children
}) => {
  const useMessageRuntime = useMessageRuntimeStore(runtime);
  const useMessageUtils = useMessageUtilsStore();
  const [context] = useState(() => {
    return { useMessageRuntime, useMessageUtils };
  });
  return /* @__PURE__ */ jsx(MessageContext.Provider, { value: context, children });
};

var isComponentsSame = (prev, next) => {
  return prev.Message === next.Message && prev.EditComposer === next.EditComposer && prev.UserEditComposer === next.UserEditComposer && prev.AssistantEditComposer === next.AssistantEditComposer && prev.SystemEditComposer === next.SystemEditComposer && prev.UserMessage === next.UserMessage && prev.AssistantMessage === next.AssistantMessage && prev.SystemMessage === next.SystemMessage;
};
var DEFAULT_SYSTEM_MESSAGE = () => null;
var getComponent = (components, role, isEditing) => {
  switch (role) {
    case "user":
      if (isEditing) {
        return components.UserEditComposer ?? components.EditComposer ?? components.UserMessage ?? components.Message;
      } else {
        return components.UserMessage ?? components.Message;
      }
    case "assistant":
      if (isEditing) {
        return components.AssistantEditComposer ?? components.EditComposer ?? components.AssistantMessage ?? components.Message;
      } else {
        return components.AssistantMessage ?? components.Message;
      }
    case "system":
      if (isEditing) {
        return components.SystemEditComposer ?? components.EditComposer ?? components.SystemMessage ?? components.Message;
      } else {
        return components.SystemMessage ?? DEFAULT_SYSTEM_MESSAGE;
      }
    default:
      const _exhaustiveCheck = role;
      throw new Error(`Unknown message role: ${_exhaustiveCheck}`);
  }
};
var ThreadMessageComponent = ({
  components
}) => {
  const role = useMessage((m) => m.role);
  const isEditing = useEditComposer((c) => c.isEditing);
  const Component = getComponent(components, role, isEditing);
  return /* @__PURE__ */ jsx(Component, {});
};
var ThreadMessageImpl = ({
  messageIndex,
  components
}) => {
  const threadRuntime = useThreadRuntime();
  const runtime = useMemo(
    () => threadRuntime.getMesssageByIndex(messageIndex),
    [threadRuntime, messageIndex]
  );
  return /* @__PURE__ */ jsx(MessageRuntimeProvider, { runtime, children: /* @__PURE__ */ jsx(ThreadMessageComponent, { components }) });
};
var ThreadMessage = memo(
  ThreadMessageImpl,
  (prev, next) => prev.messageIndex === next.messageIndex && isComponentsSame(prev.components, next.components)
);
var ThreadPrimitiveMessagesImpl = ({
  components
}) => {
  const messagesLength = useThread((t) => t.messages.length);
  if (messagesLength === 0) return null;
  return Array.from({ length: messagesLength }, (_, index) => /* @__PURE__ */ jsx(ThreadMessage, { messageIndex: index, components }, index));
};
ThreadPrimitiveMessagesImpl.displayName = "ThreadPrimitive.Messages";
var ThreadPrimitiveMessages = memo(
  ThreadPrimitiveMessagesImpl,
  (prev, next) => isComponentsSame(prev.components, next.components)
);

var useThreadScrollToBottom = () => {
  const isAtBottom = useThreadViewport((s) => s.isAtBottom);
  const threadViewportStore = useThreadViewportStore();
  const handleScrollToBottom = useCallback(() => {
    threadViewportStore.getState().scrollToBottom();
  }, [threadViewportStore]);
  if (isAtBottom) return null;
  return handleScrollToBottom;
};
var ThreadPrimitiveScrollToBottom = createActionButton(
  "ThreadPrimitive.ScrollToBottom",
  useThreadScrollToBottom
);

var useThreadSuggestion = ({
  prompt,
  autoSend
}) => {
  const threadRuntime = useThreadRuntime();
  const disabled = useThread((t) => t.isDisabled);
  const callback = useCallback(() => {
    if (autoSend && !threadRuntime.getState().isRunning) {
      threadRuntime.append(prompt);
      threadRuntime.composer.setText("");
    } else {
      threadRuntime.composer.setText(prompt);
    }
  }, [threadRuntime, autoSend, prompt]);
  if (disabled) return null;
  return callback;
};
var ThreadPrimitiveSuggestion = createActionButton(
  "ThreadPrimitive.Suggestion",
  useThreadSuggestion,
  ["prompt", "autoSend", "method"]
);

// src/runtimes/edge/converters/toCoreMessages.ts
var toCoreMessages = (messages, options = {}) => {
  return messages.map((message) => toCoreMessage(message, options));
};
var toCoreMessage = (message, options = {}) => {
  const includeId = options.unstable_includeId ?? false;
  const role = message.role;
  switch (role) {
    case "assistant":
      return {
        role,
        content: message.content.map((part) => {
          if (part.type === "ui") throw new Error("UI parts are not supported");
          if (part.type === "tool-call") {
            const { argsText, ...rest } = part;
            return rest;
          }
          return part;
        }),
        ...includeId ? { unstable_id: message.id } : {}
      };
    case "user":
      return {
        role,
        content: [
          ...message.content.map((part) => {
            if (part.type === "ui")
              throw new Error("UI parts are not supported");
            return part;
          }),
          ...message.attachments.map((a) => a.content).flat()
        ],
        ...includeId ? { unstable_id: message.id } : {}
      };
    case "system":
      return {
        role,
        content: message.content,
        ...includeId ? { unstable_id: message.id } : {}
      };
    default: {
      const unsupportedRole = role;
      throw new Error(`Unknown message role: ${unsupportedRole}`);
    }
  }
};

// src/runtimes/edge/streams/assistantDecoderStream.ts
function assistantDecoderStream() {
  const toolCallNames = /* @__PURE__ */ new Map();
  let currentToolCall;
  const endCurrentToolCall = (controller) => {
    if (!currentToolCall) return;
    controller.enqueue({
      type: "tool-call",
      toolCallType: "function",
      toolCallId: currentToolCall.id,
      toolName: currentToolCall.name,
      args: currentToolCall.argsText
    });
    currentToolCall = undefined;
  };
  return new TransformStream({
    transform({ type, value }, controller) {
      if (type !== AssistantStreamChunkType.ToolCallDelta && type !== AssistantStreamChunkType.Error) {
        endCurrentToolCall(controller);
      }
      switch (type) {
        case AssistantStreamChunkType.TextDelta: {
          controller.enqueue({
            type: "text-delta",
            textDelta: value
          });
          break;
        }
        case AssistantStreamChunkType.ToolCallBegin: {
          const { toolCallId: id, toolName: name } = value;
          toolCallNames.set(id, name);
          currentToolCall = { id, name, argsText: "" };
          controller.enqueue({
            type: "tool-call-delta",
            toolCallType: "function",
            toolCallId: id,
            toolName: name,
            argsTextDelta: ""
          });
          break;
        }
        case AssistantStreamChunkType.ToolCallDelta: {
          const { toolCallId, argsTextDelta } = value;
          const toolName = toolCallNames.get(toolCallId);
          if (currentToolCall?.id === toolCallId) {
            currentToolCall.argsText += argsTextDelta;
          }
          controller.enqueue({
            type: "tool-call-delta",
            toolCallType: "function",
            toolCallId,
            toolName,
            argsTextDelta
          });
          break;
        }
        case AssistantStreamChunkType.ToolCallResult: {
          controller.enqueue({
            type: "tool-result",
            toolCallType: "function",
            toolCallId: value.toolCallId,
            toolName: toolCallNames.get(value.toolCallId),
            result: value.result
          });
          break;
        }
        case AssistantStreamChunkType.FinishMessage: {
          controller.enqueue({
            type: "finish",
            ...value
          });
          break;
        }
        case AssistantStreamChunkType.Error: {
          controller.enqueue({
            type: "error",
            error: value
          });
          break;
        }
        case AssistantStreamChunkType.ToolCall: {
          const { toolCallId, toolName, args } = value;
          toolCallNames.set(toolCallId, toolName);
          const argsText = JSON.stringify(args);
          controller.enqueue({
            type: "tool-call-delta",
            toolCallType: "function",
            toolCallId,
            toolName,
            argsTextDelta: argsText
          });
          controller.enqueue({
            type: "tool-call",
            toolCallType: "function",
            toolCallId,
            toolName,
            args: argsText
          });
          break;
        }
        case AssistantStreamChunkType.FinishStep: {
          controller.enqueue({
            type: "step-finish",
            ...value
          });
          break;
        }
        case AssistantStreamChunkType.Annotation:
          controller.enqueue({
            type: "annotations",
            annotations: value
          });
          break;
        case AssistantStreamChunkType.Data:
          controller.enqueue({
            type: "data",
            data: value
          });
          break;
        // TODO
        case AssistantStreamChunkType.ReasoningDelta:
        case AssistantStreamChunkType.StartStep:
          break;
        default: {
          const unhandledType = type;
          throw new Error(`Unhandled chunk type: ${unhandledType}`);
        }
      }
    },
    flush(controller) {
      endCurrentToolCall(controller);
    }
  });
}

// src/runtimes/edge/streams/utils/chunkByLineStream.ts
function chunkByLineStream() {
  let buffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;
      const lines = buffer.split("\n");
      for (let i = 0; i < lines.length - 1; i++) {
        controller.enqueue(lines[i]);
      }
      buffer = lines[lines.length - 1];
    },
    flush(controller) {
      if (buffer) {
        controller.enqueue(buffer);
      }
    }
  });
}

// src/runtimes/edge/streams/utils/streamPartDecoderStream.ts
var decodeStreamPart = (part) => {
  const index = part.indexOf(":");
  if (index === -1) throw new Error("Invalid stream part");
  return {
    type: part.slice(0, index),
    value: JSON.parse(part.slice(index + 1))
  };
};
function streamPartDecoderStream() {
  const decodeStream = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(decodeStreamPart(chunk));
    }
  });
  return new PipeableTransformStream((readable) => {
    return readable.pipeThrough(new TextDecoderStream()).pipeThrough(chunkByLineStream()).pipeThrough(decodeStream);
  });
}

// src/runtimes/remote-thread-list/BaseSubscribable.tsx
var BaseSubscribable = class {
  _subscribers = /* @__PURE__ */ new Set();
  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }
  waitForUpdate() {
    return new Promise((resolve) => {
      const unsubscribe = this.subscribe(() => {
        unsubscribe();
        resolve();
      });
    });
  }
  _notifySubscribers() {
    const errors = [];
    for (const callback of this._subscribers) {
      try {
        callback();
      } catch (error) {
        errors.push(error);
      }
    }
    if (errors.length > 0) {
      if (errors.length === 1) {
        throw errors[0];
      } else {
        throw new AggregateError(errors);
      }
    }
  }
};

// src/runtimes/composer/BaseComposerRuntimeCore.tsx
var isAttachmentComplete = (a) => a.status.type === "complete";
var BaseComposerRuntimeCore = class extends BaseSubscribable {
  isEditing = true;
  getAttachmentAccept() {
    return this.getAttachmentAdapter()?.accept ?? "*";
  }
  _attachments = [];
  get attachments() {
    return this._attachments;
  }
  setAttachments(value) {
    this._attachments = value;
    this._notifySubscribers();
  }
  get isEmpty() {
    return !this.text.trim() && !this.attachments.length;
  }
  _text = "";
  get text() {
    return this._text;
  }
  _role = "user";
  get role() {
    return this._role;
  }
  _runConfig = {};
  get runConfig() {
    return this._runConfig;
  }
  setText(value) {
    if (this._text === value) return;
    this._text = value;
    this._notifySubscribers();
  }
  setRole(role) {
    if (this._role === role) return;
    this._role = role;
    this._notifySubscribers();
  }
  setRunConfig(runConfig) {
    if (this._runConfig === runConfig) return;
    this._runConfig = runConfig;
    this._notifySubscribers();
  }
  _emptyTextAndAttachments() {
    this._attachments = [];
    this._text = "";
    this._notifySubscribers();
  }
  async _onClearAttachments() {
    const adapter = this.getAttachmentAdapter();
    if (adapter) {
      await Promise.all(this._attachments.map((a) => adapter.remove(a)));
    }
  }
  async reset() {
    if (this._attachments.length === 0 && this._text === "" && this._role === "user" && Object.keys(this._runConfig).length === 0) {
      return;
    }
    this._role = "user";
    this._runConfig = {};
    const task = this._onClearAttachments();
    this._emptyTextAndAttachments();
    await task;
  }
  async clearAttachments() {
    const task = this._onClearAttachments();
    this.setAttachments([]);
    await task;
  }
  async send() {
    const adapter = this.getAttachmentAdapter();
    const attachments = adapter && this.attachments.length > 0 ? await Promise.all(
      this.attachments.map(async (a) => {
        if (isAttachmentComplete(a)) return a;
        const result = await adapter.send(a);
        return result;
      })
    ) : [];
    const message = {
      role: this.role,
      content: this.text ? [{ type: "text", text: this.text }] : [],
      attachments,
      runConfig: this.runConfig
    };
    this._emptyTextAndAttachments();
    this.handleSend(message);
    this._notifyEventSubscribers("send");
  }
  cancel() {
    this.handleCancel();
  }
  async addAttachment(file) {
    const adapter = this.getAttachmentAdapter();
    if (!adapter) throw new Error("Attachments are not supported");
    const upsertAttachment = (a) => {
      const idx = this._attachments.findIndex((attachment) => attachment.id === a.id);
      if (idx !== -1)
        this._attachments = [
          ...this._attachments.slice(0, idx),
          a,
          ...this._attachments.slice(idx + 1)
        ];
      else {
        this._attachments = [...this._attachments, a];
        this._notifyEventSubscribers("attachment_add");
      }
      this._notifySubscribers();
    };
    const promiseOrGenerator = adapter.add({ file });
    if (Symbol.asyncIterator in promiseOrGenerator) {
      for await (const r of promiseOrGenerator) {
        upsertAttachment(r);
      }
    } else {
      upsertAttachment(await promiseOrGenerator);
    }
    this._notifyEventSubscribers("attachment_add");
    this._notifySubscribers();
  }
  async removeAttachment(attachmentId) {
    const adapter = this.getAttachmentAdapter();
    if (!adapter) throw new Error("Attachments are not supported");
    const index = this._attachments.findIndex((a) => a.id === attachmentId);
    if (index === -1) throw new Error("Attachment not found");
    const attachment = this._attachments[index];
    await adapter.remove(attachment);
    this._attachments = [
      ...this._attachments.slice(0, index),
      ...this._attachments.slice(index + 1)
    ];
    this._notifySubscribers();
  }
  _eventSubscribers = /* @__PURE__ */ new Map();
  _notifyEventSubscribers(event) {
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers) return;
    for (const callback of subscribers) callback();
  }
  unstable_on(event, callback) {
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers) {
      this._eventSubscribers.set(event, /* @__PURE__ */ new Set([callback]));
    } else {
      subscribers.add(callback);
    }
    return () => {
      const subscribers2 = this._eventSubscribers.get(event);
      if (!subscribers2) return;
      subscribers2.delete(callback);
    };
  }
};

// src/runtimes/composer/DefaultThreadComposerRuntimeCore.tsx
var DefaultThreadComposerRuntimeCore = class extends BaseComposerRuntimeCore {
  constructor(runtime) {
    super();
    this.runtime = runtime;
    this.connect();
  }
  _canCancel = false;
  get canCancel() {
    return this._canCancel;
  }
  get attachments() {
    return super.attachments;
  }
  getAttachmentAdapter() {
    return this.runtime.adapters?.attachments;
  }
  connect() {
    return this.runtime.subscribe(() => {
      if (this.canCancel !== this.runtime.capabilities.cancel) {
        this._canCancel = this.runtime.capabilities.cancel;
        this._notifySubscribers();
      }
    });
  }
  async handleSend(message) {
    this.runtime.append({
      ...message,
      parentId: this.runtime.messages.at(-1)?.id ?? null,
      sourceId: null
    });
  }
  async handleCancel() {
    this.runtime.cancelRun();
  }
};

// src/utils/CompositeContextProvider.ts
var CompositeContextProvider = class {
  _providers = /* @__PURE__ */ new Set();
  getModelContext() {
    return mergeModelContexts(this._providers);
  }
  registerModelContextProvider(provider) {
    this._providers.add(provider);
    const unsubscribe = provider.subscribe?.(() => {
      this.notifySubscribers();
    });
    this.notifySubscribers();
    return () => {
      this._providers.delete(provider);
      unsubscribe?.();
      this.notifySubscribers();
    };
  }
  _subscribers = /* @__PURE__ */ new Set();
  notifySubscribers() {
    for (const callback of this._subscribers) callback();
  }
  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }
};

let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = '';
    let i = size | 0;
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0];
    }
    return id
  }
};

// src/utils/idUtils.tsx
var generateId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);
var optimisticPrefix = "__optimistic__";
var generateOptimisticId = () => `${optimisticPrefix}${generateId()}`;

// src/runtimes/utils/MessageRepository.tsx
var findHead = (message) => {
  if (message.next) return findHead(message.next);
  if ("current" in message) return message;
  return null;
};
var CachedValue = class {
  constructor(func) {
    this.func = func;
  }
  _value = null;
  get value() {
    if (this._value === null) {
      this._value = this.func();
    }
    return this._value;
  }
  dirty() {
    this._value = null;
  }
};
var MessageRepository = class {
  messages = /* @__PURE__ */ new Map();
  // message_id -> item
  head = null;
  root = {
    children: [],
    next: null
  };
  performOp(newParent, child, operation) {
    const parentOrRoot = child.prev ?? this.root;
    const newParentOrRoot = newParent ?? this.root;
    if (operation === "relink" && parentOrRoot === newParentOrRoot) return;
    if (operation !== "link") {
      parentOrRoot.children = parentOrRoot.children.filter(
        (m) => m !== child.current.id
      );
      if (parentOrRoot.next === child) {
        const fallbackId = parentOrRoot.children.at(-1);
        const fallback = fallbackId ? this.messages.get(fallbackId) : null;
        if (fallback === undefined) {
          throw new Error(
            "MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui."
          );
        }
        parentOrRoot.next = fallback;
      }
    }
    if (operation !== "cut") {
      for (let current = newParent; current; current = current.prev) {
        if (current.current.id === child.current.id) {
          throw new Error(
            "MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui."
          );
        }
      }
      newParentOrRoot.children = [
        ...newParentOrRoot.children,
        child.current.id
      ];
      if (findHead(child) === this.head || newParentOrRoot.next === null) {
        newParentOrRoot.next = child;
      }
      child.prev = newParent;
    }
  }
  _messages = new CachedValue(() => {
    const messages = new Array(this.head?.level ?? 0);
    for (let current = this.head; current; current = current.prev) {
      messages[current.level] = current.current;
    }
    return messages;
  });
  getMessages() {
    return this._messages.value;
  }
  addOrUpdateMessage(parentId, message) {
    const existingItem = this.messages.get(message.id);
    const prev = parentId ? this.messages.get(parentId) : null;
    if (prev === undefined)
      throw new Error(
        "MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui."
      );
    if (existingItem) {
      existingItem.current = message;
      this.performOp(prev, existingItem, "relink");
      this._messages.dirty();
      return;
    }
    const newItem = {
      prev,
      current: message,
      next: null,
      children: [],
      level: prev ? prev.level + 1 : 0
    };
    this.messages.set(message.id, newItem);
    this.performOp(prev, newItem, "link");
    if (this.head === prev) {
      this.head = newItem;
    }
    this._messages.dirty();
  }
  getMessage(messageId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui."
      );
    return {
      parentId: message.prev?.current.id ?? null,
      message: message.current
    };
  }
  appendOptimisticMessage(parentId, message) {
    let optimisticId;
    do {
      optimisticId = generateOptimisticId();
    } while (this.messages.has(optimisticId));
    this.addOrUpdateMessage(
      parentId,
      fromCoreMessage(message, {
        id: optimisticId,
        status: { type: "running" }
      })
    );
    return optimisticId;
  }
  deleteMessage(messageId, replacementId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(deleteMessage): Optimistic message not found. This is likely an internal bug in assistant-ui."
      );
    const replacement = replacementId === undefined ? message.prev : replacementId === null ? null : this.messages.get(replacementId);
    if (replacement === undefined)
      throw new Error(
        "MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui."
      );
    for (const child of message.children) {
      const childMessage = this.messages.get(child);
      if (!childMessage)
        throw new Error(
          "MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui."
        );
      this.performOp(replacement, childMessage, "relink");
    }
    this.performOp(null, message, "cut");
    this.messages.delete(messageId);
    if (this.head === message) {
      this.head = findHead(replacement ?? this.root);
    }
    this._messages.dirty();
  }
  getBranches(messageId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui."
      );
    const { children } = message.prev ?? this.root;
    return children;
  }
  switchToBranch(messageId) {
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui."
      );
    const prevOrRoot = message.prev ?? this.root;
    prevOrRoot.next = message;
    this.head = findHead(message);
    this._messages.dirty();
  }
  resetHead(messageId) {
    if (messageId === null) {
      this.head = null;
      this._messages.dirty();
      return;
    }
    const message = this.messages.get(messageId);
    if (!message)
      throw new Error(
        "MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui."
      );
    this.head = message;
    for (let current = message; current; current = current.prev) {
      if (current.prev) {
        current.prev.next = current;
      }
    }
    this._messages.dirty();
  }
  export() {
    const exportItems = [];
    for (const [, message] of this.messages) {
      exportItems.push({
        message: message.current,
        parentId: message.prev?.current.id ?? null
      });
    }
    return {
      headId: this.head?.current.id ?? null,
      messages: exportItems
    };
  }
  import({ headId, messages }) {
    for (const { message, parentId } of messages) {
      this.addOrUpdateMessage(parentId, message);
    }
    this.resetHead(headId ?? messages.at(-1)?.message.id ?? null);
  }
};

// src/runtimes/core/BaseAssistantRuntimeCore.tsx
var BaseAssistantRuntimeCore = class {
  _contextProvider = new CompositeContextProvider();
  registerModelContextProvider(provider) {
    return this._contextProvider.registerModelContextProvider(provider);
  }
};

var classnames = {exports: {}};

/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/

var hasRequiredClassnames;

function requireClassnames () {
	if (hasRequiredClassnames) return classnames.exports;
	hasRequiredClassnames = 1;
	(function (module) {
		/* global define */

		(function () {

			var hasOwn = {}.hasOwnProperty;

			function classNames () {
				var classes = '';

				for (var i = 0; i < arguments.length; i++) {
					var arg = arguments[i];
					if (arg) {
						classes = appendClass(classes, parseValue(arg));
					}
				}

				return classes;
			}

			function parseValue (arg) {
				if (typeof arg === 'string' || typeof arg === 'number') {
					return arg;
				}

				if (typeof arg !== 'object') {
					return '';
				}

				if (Array.isArray(arg)) {
					return classNames.apply(null, arg);
				}

				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					return arg.toString();
				}

				var classes = '';

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes = appendClass(classes, key);
					}
				}

				return classes;
			}

			function appendClass (value, newClass) {
				if (!newClass) {
					return value;
				}
			
				if (value) {
					return value + ' ' + newClass;
				}
			
				return value + newClass;
			}

			if (module.exports) {
				classNames.default = classNames;
				module.exports = classNames;
			} else {
				window.classNames = classNames;
			}
		}()); 
	} (classnames));
	return classnames.exports;
}

var classnamesExports = requireClassnames();
const classNames = /*@__PURE__*/getDefaultExportFromCjs(classnamesExports);

// src/ui/utils/withDefaults.tsx
var withDefaultProps = ({
  className,
  ...defaultProps
}) => ({ className: classNameProp, ...props }) => {
  return {
    className: classNames(className, classNameProp),
    ...defaultProps,
    ...props
  };
};
var withDefaults = (Component, defaultProps) => {
  const getProps = withDefaultProps(defaultProps);
  const WithDefaults = forwardRef(
    (props, ref) => {
      const ComponentAsAny = Component;
      return /* @__PURE__ */ jsx(ComponentAsAny, { ...getProps(props), ref });
    }
  );
  WithDefaults.displayName = "withDefaults(" + (typeof Component === "string" ? Component : Component.displayName) + ")";
  return WithDefaults;
};

// src/ui/base/tooltip.tsx
var Tooltip = (props) => {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Provider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { ...props }) });
};
Tooltip.displayName = "Tooltip";
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = withDefaults(TooltipPrimitive.Content, {
  sideOffset: 4,
  className: "aui-tooltip-content"
});
TooltipContent.displayName = "TooltipContent";

// src/ui/base/button.tsx
var buttonVariants = cva("aui-button", {
  variants: {
    variant: {
      default: "aui-button-primary",
      outline: "aui-button-outline",
      ghost: "aui-button-ghost"
    },
    size: {
      default: "aui-button-medium",
      icon: "aui-button-icon"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
var Button = forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      Primitive.button,
      {
        className: buttonVariants({ variant, size, className }),
        ...props,
        ref
      }
    );
  }
);
Button.displayName = "Button";

// src/ui/base/tooltip-icon-button.tsx
var TooltipIconButton = forwardRef(({ children, tooltip, side = "bottom", ...rest }, ref) => {
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", ...rest, ref, children: [
      children,
      /* @__PURE__ */ jsx("span", { className: "aui-sr-only", children: tooltip })
    ] }) }),
    /* @__PURE__ */ jsx(TooltipContent, { side, children: tooltip })
  ] });
});
TooltipIconButton.displayName = "TooltipIconButton";

// src/runtimes/external-store/getExternalStoreMessage.tsx
var symbolInnerMessage = Symbol("innerMessage");

// src/utils/getThreadMessageText.tsx
var getThreadMessageText = (message) => {
  const textParts = message.content.filter(
    (part) => part.type === "text"
  );
  return textParts.map((part) => part.text).join("\n\n");
};

// src/api/AttachmentRuntime.ts
var AttachmentRuntimeImpl = class {
  constructor(_core) {
    this._core = _core;
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.getState = this.getState.bind(this);
    this.remove = this.remove.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
};
var ComposerAttachmentRuntime = class extends AttachmentRuntimeImpl {
  constructor(core, _composerApi) {
    super(core);
    this._composerApi = _composerApi;
  }
  remove() {
    const core = this._composerApi.getState();
    if (!core) throw new Error("Composer is not available");
    return core.removeAttachment(this.getState().id);
  }
};
var ThreadComposerAttachmentRuntimeImpl = class extends ComposerAttachmentRuntime {
  get source() {
    return "thread-composer";
  }
};
var EditComposerAttachmentRuntimeImpl = class extends ComposerAttachmentRuntime {
  get source() {
    return "edit-composer";
  }
};
var MessageAttachmentRuntimeImpl = class extends AttachmentRuntimeImpl {
  get source() {
    return "message";
  }
  constructor(core) {
    super(core);
  }
  remove() {
    throw new Error("Message attachments cannot be removed");
  }
};

// src/api/subscribable/BaseSubject.ts
var BaseSubject = class {
  _subscriptions = /* @__PURE__ */ new Set();
  _connection;
  get isConnected() {
    return !!this._connection;
  }
  notifySubscribers() {
    for (const callback of this._subscriptions) callback();
  }
  _updateConnection() {
    if (this._subscriptions.size > 0) {
      if (this._connection) return;
      this._connection = this._connect();
    } else {
      this._connection?.();
      this._connection = undefined;
    }
  }
  subscribe(callback) {
    this._subscriptions.add(callback);
    this._updateConnection();
    return () => {
      this._subscriptions.delete(callback);
      this._updateConnection();
    };
  }
};

// src/api/subscribable/SKIP_UPDATE.ts
var SKIP_UPDATE = Symbol("skip-update");

// src/api/subscribable/LazyMemoizeSubject.ts
var LazyMemoizeSubject = class extends BaseSubject {
  constructor(binding) {
    super();
    this.binding = binding;
  }
  get path() {
    return this.binding.path;
  }
  _previousStateDirty = true;
  _previousState;
  getState = () => {
    if (!this.isConnected || this._previousStateDirty) {
      const newState = this.binding.getState();
      if (newState !== SKIP_UPDATE) {
        this._previousState = newState;
      }
      this._previousStateDirty = false;
    }
    if (this._previousState === undefined)
      throw new Error("Entry not available in the store");
    return this._previousState;
  };
  _connect() {
    const callback = () => {
      this._previousStateDirty = true;
      this.notifySubscribers();
    };
    return this.binding.subscribe(callback);
  }
};

// src/api/subscribable/shallowEqual.ts
function shallowEqual(objA, objB) {
  if (objA === undefined && objB === undefined) return true;
  if (objA === undefined) return false;
  if (objB === undefined) return false;
  for (const key of Object.keys(objA)) {
    const valueA = objA[key];
    const valueB = objB[key];
    if (!Object.is(valueA, valueB)) return false;
  }
  return true;
}

// src/api/subscribable/ShallowMemoizeSubject.ts
var ShallowMemoizeSubject = class extends BaseSubject {
  constructor(binding) {
    super();
    this.binding = binding;
    const state = binding.getState();
    if (state === SKIP_UPDATE)
      throw new Error("Entry not available in the store");
    this._previousState = state;
  }
  get path() {
    return this.binding.path;
  }
  _previousState;
  getState = () => {
    if (!this.isConnected) this._syncState();
    return this._previousState;
  };
  _syncState() {
    const state = this.binding.getState();
    if (state === SKIP_UPDATE) return false;
    if (shallowEqual(state, this._previousState)) return false;
    this._previousState = state;
    return true;
  }
  _connect() {
    const callback = () => {
      if (this._syncState()) {
        this.notifySubscribers();
      }
    };
    return this.binding.subscribe(callback);
  }
};

// src/api/subscribable/EventSubscriptionSubject.ts
var EventSubscriptionSubject = class extends BaseSubject {
  constructor(config) {
    super();
    this.config = config;
  }
  getState() {
    return this.config.binding.getState();
  }
  outerSubscribe(callback) {
    return this.config.binding.subscribe(callback);
  }
  _connect() {
    const callback = () => {
      this.notifySubscribers();
    };
    let lastState = this.config.binding.getState();
    let innerUnsubscribe = lastState?.unstable_on(this.config.event, callback);
    const onRuntimeUpdate = () => {
      const newState = this.config.binding.getState();
      if (newState === lastState) return;
      lastState = newState;
      innerUnsubscribe?.();
      innerUnsubscribe = this.config.binding.getState()?.unstable_on(this.config.event, callback);
    };
    const outerUnsubscribe = this.outerSubscribe(onRuntimeUpdate);
    return () => {
      outerUnsubscribe?.();
      innerUnsubscribe?.();
    };
  }
};

// src/api/ComposerRuntime.ts
var EMPTY_ARRAY = Object.freeze([]);
var EMPTY_OBJECT = Object.freeze({});
var getThreadComposerState = (runtime) => {
  return Object.freeze({
    type: "thread",
    isEditing: runtime?.isEditing ?? false,
    canCancel: runtime?.canCancel ?? false,
    isEmpty: runtime?.isEmpty ?? true,
    attachments: runtime?.attachments ?? EMPTY_ARRAY,
    text: runtime?.text ?? "",
    role: runtime?.role ?? "user",
    runConfig: runtime?.runConfig ?? EMPTY_OBJECT,
    value: runtime?.text ?? ""
  });
};
var getEditComposerState = (runtime) => {
  return Object.freeze({
    type: "edit",
    isEditing: runtime?.isEditing ?? false,
    canCancel: runtime?.canCancel ?? false,
    isEmpty: runtime?.isEmpty ?? true,
    text: runtime?.text ?? "",
    role: runtime?.role ?? "user",
    attachments: runtime?.attachments ?? EMPTY_ARRAY,
    runConfig: runtime?.runConfig ?? EMPTY_OBJECT,
    value: runtime?.text ?? ""
  });
};
var ComposerRuntimeImpl = class {
  constructor(_core) {
    this._core = _core;
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.setText = this.setText.bind(this);
    this.setRunConfig = this.setRunConfig.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.addAttachment = this.addAttachment.bind(this);
    this.reset = this.reset.bind(this);
    this.clearAttachments = this.clearAttachments.bind(this);
    this.send = this.send.bind(this);
    this.cancel = this.cancel.bind(this);
    this.setRole = this.setRole.bind(this);
    this.getAttachmentAccept = this.getAttachmentAccept.bind(this);
    this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this);
    this.unstable_on = this.unstable_on.bind(this);
  }
  setText(text) {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    core.setText(text);
  }
  setRunConfig(runConfig) {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    core.setRunConfig(runConfig);
  }
  addAttachment(file) {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    return core.addAttachment(file);
  }
  reset() {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    return core.reset();
  }
  clearAttachments() {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    return core.clearAttachments();
  }
  send() {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    core.send();
  }
  cancel() {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    core.cancel();
  }
  setRole(role) {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    core.setRole(role);
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
  _eventSubscriptionSubjects = /* @__PURE__ */ new Map();
  unstable_on(event, callback) {
    let subject = this._eventSubscriptionSubjects.get(event);
    if (!subject) {
      subject = new EventSubscriptionSubject({
        event,
        binding: this._core
      });
      this._eventSubscriptionSubjects.set(event, subject);
    }
    return subject.subscribe(callback);
  }
  getAttachmentAccept() {
    const core = this._core.getState();
    if (!core) throw new Error("Composer is not available");
    return core.getAttachmentAccept();
  }
};
var ThreadComposerRuntimeImpl = class extends ComposerRuntimeImpl {
  get path() {
    return this._core.path;
  }
  get type() {
    return "thread";
  }
  _getState;
  constructor(core) {
    const stateBinding = new LazyMemoizeSubject({
      path: core.path,
      getState: () => getThreadComposerState(core.getState()),
      subscribe: (callback) => core.subscribe(callback)
    });
    super({
      path: core.path,
      getState: () => core.getState(),
      subscribe: (callback) => stateBinding.subscribe(callback)
    });
    this._getState = stateBinding.getState.bind(stateBinding);
  }
  getState() {
    return this._getState();
  }
  getAttachmentByIndex(idx) {
    return new ThreadComposerAttachmentRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ...this.path,
          attachmentSource: "thread-composer",
          attachmentSelector: { type: "index", index: idx },
          ref: this.path.ref + `${this.path.ref}.attachments[${idx}]`
        },
        getState: () => {
          const attachments = this.getState().attachments;
          const attachment = attachments[idx];
          if (!attachment) return SKIP_UPDATE;
          return {
            ...attachment,
            source: "thread-composer"
          };
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
  }
};
var EditComposerRuntimeImpl = class extends ComposerRuntimeImpl {
  constructor(core, _beginEdit) {
    const stateBinding = new LazyMemoizeSubject({
      path: core.path,
      getState: () => getEditComposerState(core.getState()),
      subscribe: (callback) => core.subscribe(callback)
    });
    super({
      path: core.path,
      getState: () => core.getState(),
      subscribe: (callback) => stateBinding.subscribe(callback)
    });
    this._beginEdit = _beginEdit;
    this._getState = stateBinding.getState.bind(stateBinding);
  }
  get path() {
    return this._core.path;
  }
  get type() {
    return "edit";
  }
  _getState;
  __internal_bindMethods() {
    super.__internal_bindMethods();
    this.beginEdit = this.beginEdit.bind(this);
  }
  getState() {
    return this._getState();
  }
  beginEdit() {
    this._beginEdit();
  }
  getAttachmentByIndex(idx) {
    return new EditComposerAttachmentRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ...this.path,
          attachmentSource: "edit-composer",
          attachmentSelector: { type: "index", index: idx },
          ref: this.path.ref + `${this.path.ref}.attachments[${idx}]`
        },
        getState: () => {
          const attachments = this.getState().attachments;
          const attachment = attachments[idx];
          if (!attachment) return SKIP_UPDATE;
          return {
            ...attachment,
            source: "edit-composer"
          };
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
  }
};

// src/api/subscribable/NestedSubscriptionSubject.ts
var NestedSubscriptionSubject = class extends BaseSubject {
  constructor(binding) {
    super();
    this.binding = binding;
  }
  get path() {
    return this.binding.path;
  }
  getState() {
    return this.binding.getState();
  }
  outerSubscribe(callback) {
    return this.binding.subscribe(callback);
  }
  _connect() {
    const callback = () => {
      this.notifySubscribers();
    };
    let lastState = this.binding.getState();
    let innerUnsubscribe = lastState?.subscribe(callback);
    const onRuntimeUpdate = () => {
      const newState = this.binding.getState();
      if (newState === lastState) return;
      lastState = newState;
      innerUnsubscribe?.();
      innerUnsubscribe = this.binding.getState()?.subscribe(callback);
      callback();
    };
    const outerUnsubscribe = this.outerSubscribe(onRuntimeUpdate);
    return () => {
      outerUnsubscribe?.();
      innerUnsubscribe?.();
    };
  }
};

// src/api/MessageRuntime.ts
var COMPLETE_STATUS = Object.freeze({
  type: "complete"
});
var toContentPartStatus = (message, partIndex, part) => {
  if (message.role !== "assistant") return COMPLETE_STATUS;
  if (part.type === "tool-call") {
    if (!part.result) {
      return message.status;
    } else {
      return COMPLETE_STATUS;
    }
  }
  const isLastPart = partIndex === Math.max(0, message.content.length - 1);
  if (message.status.type === "requires-action") return COMPLETE_STATUS;
  return isLastPart ? message.status : COMPLETE_STATUS;
};
var getContentPartState = (message, partIndex) => {
  let part = message.content[partIndex];
  if (!part) {
    return SKIP_UPDATE;
  }
  const status = toContentPartStatus(message, partIndex, part);
  return Object.freeze({
    ...part,
    ...{ [symbolInnerMessage]: part[symbolInnerMessage] },
    status
  });
};
var MessageRuntimeImpl = class {
  constructor(_core, _threadBinding) {
    this._core = _core;
    this._threadBinding = _threadBinding;
    this.composer = new EditComposerRuntimeImpl(
      new NestedSubscriptionSubject({
        path: {
          ...this.path,
          ref: this.path.ref + `${this.path.ref}.composer`,
          composerSource: "edit"
        },
        getState: () => this._threadBinding.getState().getEditComposer(this._core.getState().id),
        subscribe: (callback) => this._threadBinding.subscribe(callback)
      }),
      () => this._threadBinding.getState().beginEdit(this._core.getState().id)
    );
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.reload = this.reload.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getContentPartByIndex = this.getContentPartByIndex.bind(this);
    this.getContentPartByToolCallId = this.getContentPartByToolCallId.bind(this);
    this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this);
    this.unstable_getCopyText = this.unstable_getCopyText.bind(this);
    this.speak = this.speak.bind(this);
    this.stopSpeaking = this.stopSpeaking.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
    this.switchToBranch = this.switchToBranch.bind(this);
  }
  composer;
  getState() {
    return this._core.getState();
  }
  reload({ runConfig = {} } = {}) {
    const state = this._core.getState();
    if (state.role !== "assistant")
      throw new Error("Can only reload assistant messages");
    this._threadBinding.getState().startRun({
      parentId: state.parentId,
      sourceId: state.id,
      runConfig
    });
  }
  speak() {
    const state = this._core.getState();
    return this._threadBinding.getState().speak(state.id);
  }
  stopSpeaking() {
    const state = this._core.getState();
    const thread = this._threadBinding.getState();
    if (thread.speech?.messageId === state.id) {
      this._threadBinding.getState().stopSpeaking();
    } else {
      throw new Error("Message is not being spoken");
    }
  }
  submitFeedback({ type }) {
    const state = this._core.getState();
    this._threadBinding.getState().submitFeedback({
      messageId: state.id,
      type
    });
  }
  switchToBranch({
    position,
    branchId
  }) {
    const state = this._core.getState();
    if (branchId && position) {
      throw new Error("May not specify both branchId and position");
    } else if (!branchId && !position) {
      throw new Error("Must specify either branchId or position");
    }
    const thread = this._threadBinding.getState();
    const branches = thread.getBranches(state.id);
    let targetBranch = branchId;
    if (position === "previous") {
      targetBranch = branches[state.branchNumber - 2];
    } else if (position === "next") {
      targetBranch = branches[state.branchNumber];
    }
    if (!targetBranch) throw new Error("Branch not found");
    this._threadBinding.getState().switchToBranch(targetBranch);
  }
  unstable_getCopyText() {
    return getThreadMessageText(this.getState());
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
  getContentPartByIndex(idx) {
    if (idx < 0) throw new Error("Content part index must be >= 0");
    return new ContentPartRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ...this.path,
          ref: this.path.ref + `${this.path.ref}.content[${idx}]`,
          contentPartSelector: { type: "index", index: idx }
        },
        getState: () => {
          return getContentPartState(this.getState(), idx);
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core,
      this._threadBinding
    );
  }
  getContentPartByToolCallId(toolCallId) {
    return new ContentPartRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ...this.path,
          ref: this.path.ref + `${this.path.ref}.content[toolCallId=${JSON.stringify(toolCallId)}]`,
          contentPartSelector: { type: "toolCallId", toolCallId }
        },
        getState: () => {
          const state = this._core.getState();
          const idx = state.content.findIndex(
            (part) => part.type === "tool-call" && part.toolCallId === toolCallId
          );
          if (idx === -1) return SKIP_UPDATE;
          return getContentPartState(state, idx);
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core,
      this._threadBinding
    );
  }
  getAttachmentByIndex(idx) {
    return new MessageAttachmentRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ...this.path,
          ref: this.path.ref + `${this.path.ref}.attachments[${idx}]`,
          attachmentSource: "message",
          attachmentSelector: { type: "index", index: idx }
        },
        getState: () => {
          const attachments = this.getState().attachments;
          const attachment = attachments?.[idx];
          if (!attachment) return SKIP_UPDATE;
          return {
            ...attachment,
            source: "message"
          };
        },
        subscribe: (callback) => this._core.subscribe(callback)
      })
    );
  }
};

// src/api/ThreadRuntime.ts
var toStartRunConfig = (message) => {
  return {
    parentId: message.parentId ?? null,
    sourceId: message.sourceId ?? null,
    runConfig: message.runConfig ?? {}
  };
};
var toAppendMessage = (messages, message) => {
  if (typeof message === "string") {
    return {
      parentId: messages.at(-1)?.id ?? null,
      sourceId: null,
      runConfig: {},
      role: "user",
      content: [{ type: "text", text: message }],
      attachments: []
    };
  }
  if (message.role && message.parentId && message.attachments) {
    return message;
  }
  return {
    ...message,
    parentId: message.parentId ?? messages.at(-1)?.id ?? null,
    sourceId: message.sourceId ?? null,
    role: message.role ?? "user",
    attachments: message.attachments ?? []
  };
};
var getThreadState = (runtime, threadListItemState) => {
  const lastMessage = runtime.messages.at(-1);
  return Object.freeze({
    threadId: threadListItemState.id,
    metadata: threadListItemState,
    capabilities: runtime.capabilities,
    isDisabled: runtime.isDisabled,
    isRunning: lastMessage?.role !== "assistant" ? false : lastMessage.status.type === "running",
    messages: runtime.messages,
    suggestions: runtime.suggestions,
    extras: runtime.extras,
    speech: runtime.speech
  });
};
var ThreadRuntimeImpl = class {
  get path() {
    return this._threadBinding.path;
  }
  get __internal_threadBinding() {
    return this._threadBinding;
  }
  _threadBinding;
  constructor(threadBinding, threadListItemBinding) {
    const stateBinding = new LazyMemoizeSubject({
      path: threadBinding.path,
      getState: () => getThreadState(
        threadBinding.getState(),
        threadListItemBinding.getState()
      ),
      subscribe: (callback) => {
        const sub1 = threadBinding.subscribe(callback);
        const sub2 = threadListItemBinding.subscribe(callback);
        return () => {
          sub1();
          sub2();
        };
      }
    });
    this._threadBinding = {
      path: threadBinding.path,
      getState: () => threadBinding.getState(),
      getStateState: () => stateBinding.getState(),
      outerSubscribe: (callback) => threadBinding.outerSubscribe(callback),
      subscribe: (callback) => threadBinding.subscribe(callback)
    };
    this.composer = new ThreadComposerRuntimeImpl(
      new NestedSubscriptionSubject({
        path: {
          ...this.path,
          ref: this.path.ref + `${this.path.ref}.composer`,
          composerSource: "thread"
        },
        getState: () => this._threadBinding.getState().composer,
        subscribe: (callback) => this._threadBinding.subscribe(callback)
      })
    );
  }
  __internal_bindMethods() {
    this.append = this.append.bind(this);
    this.startRun = this.startRun.bind(this);
    this.cancelRun = this.cancelRun.bind(this);
    this.stopSpeaking = this.stopSpeaking.bind(this);
    this.export = this.export.bind(this);
    this.import = this.import.bind(this);
    this.getMesssageByIndex = this.getMesssageByIndex.bind(this);
    this.getMesssageById = this.getMesssageById.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unstable_on = this.unstable_on.bind(this);
    this.getModelContext = this.getModelContext.bind(this);
    this.getModelConfig = this.getModelConfig.bind(this);
    this.getState = this.getState.bind(this);
  }
  composer;
  getState() {
    return this._threadBinding.getStateState();
  }
  append(message) {
    this._threadBinding.getState().append(
      toAppendMessage(this._threadBinding.getState().messages, message)
    );
  }
  subscribe(callback) {
    return this._threadBinding.subscribe(callback);
  }
  getModelContext() {
    return this._threadBinding.getState().getModelContext();
  }
  getModelConfig() {
    return this.getModelContext();
  }
  startRun(configOrParentId) {
    const config = configOrParentId === null || typeof configOrParentId === "string" ? { parentId: configOrParentId } : configOrParentId;
    return this._threadBinding.getState().startRun(toStartRunConfig(config));
  }
  cancelRun() {
    this._threadBinding.getState().cancelRun();
  }
  stopSpeaking() {
    return this._threadBinding.getState().stopSpeaking();
  }
  export() {
    return this._threadBinding.getState().export();
  }
  import(data) {
    this._threadBinding.getState().import(data);
  }
  getMesssageByIndex(idx) {
    if (idx < 0) throw new Error("Message index must be >= 0");
    return this._getMessageRuntime(
      {
        ...this.path,
        ref: this.path.ref + `${this.path.ref}.messages[${idx}]`,
        messageSelector: { type: "index", index: idx }
      },
      () => {
        const messages = this._threadBinding.getState().messages;
        const message = messages[idx];
        if (!message) return undefined;
        return {
          message,
          parentId: messages[idx - 1]?.id ?? null
        };
      }
    );
  }
  getMesssageById(messageId) {
    return this._getMessageRuntime(
      {
        ...this.path,
        ref: this.path.ref + `${this.path.ref}.messages[messageId=${JSON.stringify(messageId)}]`,
        messageSelector: { type: "messageId", messageId }
      },
      () => this._threadBinding.getState().getMessageById(messageId)
    );
  }
  _getMessageRuntime(path, callback) {
    return new MessageRuntimeImpl(
      new ShallowMemoizeSubject({
        path,
        getState: () => {
          const { message, parentId } = callback() ?? {};
          const { messages, speech: speechState } = this._threadBinding.getState();
          if (!message || parentId === undefined) return SKIP_UPDATE;
          const thread = this._threadBinding.getState();
          const branches = thread.getBranches(message.id);
          const submittedFeedback = thread.getSubmittedFeedback(message.id);
          return {
            ...message,
            ...{ [symbolInnerMessage]: message[symbolInnerMessage] },
            isLast: messages.at(-1)?.id === message.id,
            parentId,
            branchNumber: branches.indexOf(message.id) + 1,
            branchCount: branches.length,
            speech: speechState?.messageId === message.id ? speechState : undefined,
            submittedFeedback
          };
        },
        subscribe: (callback2) => this._threadBinding.subscribe(callback2)
      }),
      this._threadBinding
    );
  }
  _eventSubscriptionSubjects = /* @__PURE__ */ new Map();
  unstable_on(event, callback) {
    let subject = this._eventSubscriptionSubjects.get(event);
    if (!subject) {
      subject = new EventSubscriptionSubject({
        event,
        binding: this._threadBinding
      });
      this._eventSubscriptionSubjects.set(event, subject);
    }
    return subject.subscribe(callback);
  }
};

// src/api/ThreadListItemRuntime.ts
var ThreadListItemRuntimeImpl = class {
  constructor(_core, _threadListBinding) {
    this._core = _core;
    this._threadListBinding = _threadListBinding;
  }
  get path() {
    return this._core.path;
  }
  __internal_bindMethods() {
    this.switchTo = this.switchTo.bind(this);
    this.rename = this.rename.bind(this);
    this.archive = this.archive.bind(this);
    this.unarchive = this.unarchive.bind(this);
    this.delete = this.delete.bind(this);
    this.initialize = this.initialize.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unstable_on = this.unstable_on.bind(this);
    this.getState = this.getState.bind(this);
  }
  getState() {
    return this._core.getState();
  }
  switchTo() {
    const state = this._core.getState();
    return this._threadListBinding.switchToThread(state.id);
  }
  rename(newTitle) {
    const state = this._core.getState();
    return this._threadListBinding.rename(state.id, newTitle);
  }
  archive() {
    const state = this._core.getState();
    return this._threadListBinding.archive(state.id);
  }
  unarchive() {
    const state = this._core.getState();
    return this._threadListBinding.unarchive(state.id);
  }
  delete() {
    const state = this._core.getState();
    return this._threadListBinding.delete(state.id);
  }
  initialize() {
    const state = this._core.getState();
    return this._threadListBinding.initialize(state.id);
  }
  unstable_on(event, callback) {
    let prevIsMain = this._core.getState().isMain;
    return this.subscribe(() => {
      const newIsMain = this._core.getState().isMain;
      if (prevIsMain === newIsMain) return;
      prevIsMain = newIsMain;
      if (event === "switched-to" && !newIsMain) return;
      if (event === "switched-away" && newIsMain) return;
      callback();
    });
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
};

// src/api/ThreadListRuntime.ts
var getThreadListState = (threadList) => {
  return {
    mainThreadId: threadList.mainThreadId,
    newThread: threadList.newThreadId,
    threads: threadList.threadIds,
    archivedThreads: threadList.archivedThreadIds
  };
};
var getThreadListItemState = (threadList, threadId) => {
  if (threadId === undefined) return SKIP_UPDATE;
  const threadData = threadList.getItemById(threadId);
  if (!threadData) return SKIP_UPDATE;
  return {
    id: threadData.threadId,
    threadId: threadData.threadId,
    // TODO remove in 0.8.0
    remoteId: threadData.remoteId,
    externalId: threadData.externalId,
    title: threadData.title,
    status: threadData.status,
    isMain: threadData.threadId === threadList.mainThreadId
  };
};
var ThreadListRuntimeImpl = class {
  constructor(_core, _runtimeFactory = ThreadRuntimeImpl) {
    this._core = _core;
    this._runtimeFactory = _runtimeFactory;
    const stateBinding = new LazyMemoizeSubject({
      path: {},
      getState: () => getThreadListState(_core),
      subscribe: (callback) => _core.subscribe(callback)
    });
    this._getState = stateBinding.getState.bind(stateBinding);
    this._mainThreadListItemRuntime = new ThreadListItemRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ref: `threadItems[main]`,
          threadSelector: { type: "main" }
        },
        getState: () => {
          return getThreadListItemState(this._core, this._core.mainThreadId);
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
    this.main = new _runtimeFactory(
      new NestedSubscriptionSubject({
        path: {
          ref: "threads.main",
          threadSelector: { type: "main" }
        },
        getState: () => _core.getMainThreadRuntimeCore(),
        subscribe: (callback) => _core.subscribe(callback)
      }),
      this._mainThreadListItemRuntime
      // TODO capture "main" threadListItem from context around useLocalRuntime / useExternalStoreRuntime
    );
  }
  _getState;
  __internal_bindMethods() {
    this.switchToThread = this.switchToThread.bind(this);
    this.switchToNewThread = this.switchToNewThread.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getById = this.getById.bind(this);
    this.getItemById = this.getItemById.bind(this);
    this.getItemByIndex = this.getItemByIndex.bind(this);
    this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
  }
  switchToThread(threadId) {
    return this._core.switchToThread(threadId);
  }
  switchToNewThread() {
    return this._core.switchToNewThread();
  }
  getState() {
    return this._getState();
  }
  subscribe(callback) {
    return this._core.subscribe(callback);
  }
  _mainThreadListItemRuntime;
  main;
  get mainItem() {
    return this._mainThreadListItemRuntime;
  }
  getById(threadId) {
    return new this._runtimeFactory(
      new NestedSubscriptionSubject({
        path: {
          ref: "threads[threadId=" + JSON.stringify(threadId) + "]",
          threadSelector: { type: "threadId", threadId }
        },
        getState: () => this._core.getThreadRuntimeCore(threadId),
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this.mainItem
      // TODO capture "main" threadListItem from context around useLocalRuntime / useExternalStoreRuntime
    );
  }
  getItemByIndex(idx) {
    return new ThreadListItemRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ref: `threadItems[${idx}]`,
          threadSelector: { type: "index", index: idx }
        },
        getState: () => {
          return getThreadListItemState(this._core, this._core.threadIds[idx]);
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
  }
  getArchivedItemByIndex(idx) {
    return new ThreadListItemRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ref: `archivedThreadItems[${idx}]`,
          threadSelector: { type: "archiveIndex", index: idx }
        },
        getState: () => {
          return getThreadListItemState(
            this._core,
            this._core.archivedThreadIds[idx]
          );
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
  }
  getItemById(threadId) {
    return new ThreadListItemRuntimeImpl(
      new ShallowMemoizeSubject({
        path: {
          ref: `threadItems[threadId=${threadId}]`,
          threadSelector: { type: "threadId", threadId }
        },
        getState: () => {
          return getThreadListItemState(this._core, threadId);
        },
        subscribe: (callback) => this._core.subscribe(callback)
      }),
      this._core
    );
  }
};

// src/api/AssistantRuntime.ts
var AssistantRuntimeImpl = class _AssistantRuntimeImpl {
  constructor(_core, runtimeFactory = ThreadRuntimeImpl) {
    this._core = _core;
    this.threads = new ThreadListRuntimeImpl(_core.threads, runtimeFactory);
    this._thread = this.threadList.main;
  }
  threads;
  get threadList() {
    return this.threads;
  }
  _thread;
  __internal_bindMethods() {
    this.switchToNewThread = this.switchToNewThread.bind(this);
    this.switchToThread = this.switchToThread.bind(this);
    this.registerModelContextProvider = this.registerModelContextProvider.bind(this);
    this.registerModelConfigProvider = this.registerModelConfigProvider.bind(this);
  }
  get thread() {
    return this._thread;
  }
  switchToNewThread() {
    return this._core.threads.switchToNewThread();
  }
  switchToThread(threadId) {
    return this._core.threads.switchToThread(threadId);
  }
  registerModelContextProvider(provider) {
    return this._core.registerModelContextProvider(provider);
  }
  registerModelConfigProvider(provider) {
    return this.registerModelContextProvider(provider);
  }
  static create(_core, runtimeFactory = ThreadRuntimeImpl) {
    return new _AssistantRuntimeImpl(_core, runtimeFactory);
  }
};

// src/runtimes/external-store/ThreadMessageLike.tsx
var fromThreadMessageLike = (like, fallbackId, fallbackStatus) => {
  const { role, id, createdAt, attachments, status, metadata } = like;
  const common = {
    id: id ?? fallbackId,
    createdAt: createdAt ?? /* @__PURE__ */ new Date()
  };
  const content = typeof like.content === "string" ? [{ type: "text", text: like.content }] : like.content;
  if (role !== "user" && attachments)
    throw new Error("attachments are only supported for user messages");
  if (role !== "assistant" && status)
    throw new Error("status is only supported for assistant messages");
  if (role !== "assistant" && metadata?.steps)
    throw new Error("metadata.steps is only supported for assistant messages");
  switch (role) {
    case "assistant":
      return {
        ...common,
        role,
        content: content.map((part) => {
          const type = part.type;
          switch (type) {
            case "text":
              if (part.text.trim().length === 0) return null;
              return part;
            case "ui":
              return part;
            case "tool-call": {
              if ("argsText" in part) return part;
              return {
                ...part,
                argsText: JSON.stringify(part.args)
              };
            }
            default: {
              const unhandledType = type;
              throw new Error(
                `Unsupported assistant content part type: ${unhandledType}`
              );
            }
          }
        }).filter((c) => !!c),
        status: status ?? fallbackStatus,
        metadata: {
          unstable_annotations: metadata?.unstable_annotations ?? [],
          unstable_data: metadata?.unstable_data ?? [],
          custom: metadata?.custom ?? {},
          steps: metadata?.steps ?? []
        }
      };
    case "user":
      return {
        ...common,
        role,
        content: content.map((part) => {
          const type = part.type;
          switch (type) {
            case "text":
            case "ui":
            case "image":
            case "audio":
            case "file":
              return part;
            default: {
              const unhandledType = type;
              throw new Error(
                `Unsupported user content part type: ${unhandledType}`
              );
            }
          }
        }),
        attachments: attachments ?? [],
        metadata: {
          custom: metadata?.custom ?? {}
        }
      };
    case "system":
      if (content.length !== 1 || content[0].type !== "text")
        throw new Error(
          "System messages must have exactly one text content part."
        );
      return {
        ...common,
        role,
        content,
        metadata: {
          custom: metadata?.custom ?? {}
        }
      };
    default: {
      const unsupportedRole = role;
      throw new Error(`Unknown message role: ${unsupportedRole}`);
    }
  }
};

// src/runtimes/external-store/auto-status.tsx
var AUTO_STATUS_RUNNING = Object.freeze({ type: "running" });
var AUTO_STATUS_COMPLETE = Object.freeze({
  type: "complete",
  reason: "unknown"
});
var getAutoStatus = (isLast, isRunning) => isLast && isRunning ? AUTO_STATUS_RUNNING : AUTO_STATUS_COMPLETE;

// src/runtimes/edge/converters/fromCoreMessage.ts
var fromCoreMessage = (message, {
  id = generateId(),
  status = { type: "complete", reason: "unknown" },
  attachments = []
} = {}) => {
  const commonProps = {
    id,
    createdAt: /* @__PURE__ */ new Date()
  };
  const role = message.role;
  switch (role) {
    case "assistant":
      return {
        ...commonProps,
        role,
        content: message.content.map((part) => {
          if (part.type === "tool-call") {
            return {
              ...part,
              argsText: JSON.stringify(part.args)
            };
          }
          return part;
        }),
        status,
        metadata: {
          unstable_annotations: [],
          unstable_data: [],
          steps: [],
          custom: {}
        }
      };
    case "user":
      return {
        ...commonProps,
        role,
        content: message.content,
        attachments,
        metadata: { custom: {} }
      };
    case "system":
      return {
        ...commonProps,
        role,
        content: message.content,
        metadata: { custom: {} }
      };
    default: {
      const unsupportedRole = role;
      throw new Error(`Unknown message role: ${unsupportedRole}`);
    }
  }
};

// src/runtimes/edge/EdgeChatAdapter.ts
function asAsyncIterable(source) {
  return {
    [Symbol.asyncIterator]: () => {
      const reader = source.getReader();
      return {
        async next() {
          const { done, value } = await reader.read();
          return done ? { done: true, value: undefined } : { done: false, value };
        }
      };
    }
  };
}
var EdgeChatAdapter = class {
  constructor(options) {
    this.options = options;
  }
  async *run({
    messages,
    runConfig,
    abortSignal,
    context,
    unstable_assistantMessageId
  }) {
    const headers = new Headers(this.options.headers);
    headers.set("Content-Type", "application/json");
    const result = await fetch(this.options.api, {
      method: "POST",
      headers,
      credentials: this.options.credentials ?? "same-origin",
      body: JSON.stringify({
        system: context.system,
        messages: this.options.unstable_AISDKInterop ? toLanguageModelMessages(messages, {
          unstable_includeId: this.options.unstable_sendMessageIds
        }) : toCoreMessages(messages, {
          unstable_includeId: this.options.unstable_sendMessageIds
        }),
        tools: context.tools ? toLanguageModelTools(context.tools) : [],
        unstable_assistantMessageId,
        runConfig,
        ...context.callSettings,
        ...context.config,
        ...this.options.body
      }),
      signal: abortSignal
    });
    if (!result.ok) {
      throw new Error(`Status ${result.status}: ${await result.text()}`);
    }
    const stream = result.body.pipeThrough(streamPartDecoderStream()).pipeThrough(assistantDecoderStream()).pipeThrough(toolResultStream(context.tools, abortSignal)).pipeThrough(runResultStream());
    let update;
    for await (update of asAsyncIterable(stream)) {
      yield update;
    }
    if (update === undefined)
      throw new Error("No data received from Edge Runtime");
  }
};

// src/runtimes/local/LocalRuntimeOptions.tsx
var splitLocalRuntimeOptions = (options) => {
  const {
    initialMessages,
    maxSteps,
    adapters,
    unstable_shouldContinueIgnoreToolNames,
    ...rest
  } = options;
  return {
    localRuntimeOptions: {
      initialMessages,
      maxSteps,
      adapters,
      unstable_shouldContinueIgnoreToolNames
    },
    otherOptions: rest
  };
};

var useEdgeRuntime = (options) => {
  const { localRuntimeOptions, otherOptions } = splitLocalRuntimeOptions(options);
  return useLocalRuntime(
    new EdgeChatAdapter(otherOptions),
    localRuntimeOptions
  );
};

// src/runtimes/composer/DefaultEditComposerRuntimeCore.tsx
var DefaultEditComposerRuntimeCore = class extends BaseComposerRuntimeCore {
  constructor(runtime, endEditCallback, { parentId, message }) {
    super();
    this.runtime = runtime;
    this.endEditCallback = endEditCallback;
    this._parentId = parentId;
    this._sourceId = message.id;
    this._previousText = getThreadMessageText(message);
    this.setText(this._previousText);
    this.setRole(message.role);
    this.setAttachments(message.attachments ?? []);
    this._nonTextParts = message.content.filter(
      (part) => part.type !== "text" && part.type !== "ui"
    );
  }
  get canCancel() {
    return true;
  }
  getAttachmentAdapter() {
    return this.runtime.adapters?.attachments;
  }
  _nonTextParts;
  _previousText;
  _parentId;
  _sourceId;
  async handleSend(message) {
    const text = getThreadMessageText(message);
    if (text !== this._previousText) {
      this.runtime.append({
        ...message,
        content: [...message.content, ...this._nonTextParts],
        parentId: this._parentId,
        sourceId: this._sourceId
      });
    }
    this.handleCancel();
  }
  handleCancel() {
    this.endEditCallback();
    this._notifySubscribers();
  }
};

// src/runtimes/core/BaseThreadRuntimeCore.tsx
var BaseThreadRuntimeCore = class {
  constructor(_contextProvider) {
    this._contextProvider = _contextProvider;
  }
  _subscriptions = /* @__PURE__ */ new Set();
  _isInitialized = false;
  repository = new MessageRepository();
  get messages() {
    return this.repository.getMessages();
  }
  composer = new DefaultThreadComposerRuntimeCore(this);
  getModelContext() {
    return this._contextProvider.getModelContext();
  }
  _editComposers = /* @__PURE__ */ new Map();
  getEditComposer(messageId) {
    return this._editComposers.get(messageId);
  }
  beginEdit(messageId) {
    if (this._editComposers.has(messageId))
      throw new Error("Edit already in progress");
    this._editComposers.set(
      messageId,
      new DefaultEditComposerRuntimeCore(
        this,
        () => this._editComposers.delete(messageId),
        this.repository.getMessage(messageId)
      )
    );
    this._notifySubscribers();
  }
  getMessageById(messageId) {
    return this.repository.getMessage(messageId);
  }
  getBranches(messageId) {
    return this.repository.getBranches(messageId);
  }
  switchToBranch(branchId) {
    this.repository.switchToBranch(branchId);
    this._notifySubscribers();
  }
  _notifySubscribers() {
    for (const callback of this._subscriptions) callback();
  }
  _notifyEventSubscribers(event) {
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers) return;
    for (const callback of subscribers) callback();
  }
  subscribe(callback) {
    this._subscriptions.add(callback);
    return () => this._subscriptions.delete(callback);
  }
  _submittedFeedback = {};
  getSubmittedFeedback(messageId) {
    return this._submittedFeedback[messageId];
  }
  submitFeedback({ messageId, type }) {
    const adapter = this.adapters?.feedback;
    if (!adapter) throw new Error("Feedback adapter not configured");
    const { message } = this.repository.getMessage(messageId);
    adapter.submit({ message, type });
    this._submittedFeedback[messageId] = { type };
    this._notifySubscribers();
  }
  _stopSpeaking;
  speech;
  speak(messageId) {
    const adapter = this.adapters?.speech;
    if (!adapter) throw new Error("Speech adapter not configured");
    const { message } = this.repository.getMessage(messageId);
    this._stopSpeaking?.();
    const utterance = adapter.speak(getThreadMessageText(message));
    const unsub = utterance.subscribe(() => {
      if (utterance.status.type === "ended") {
        this._stopSpeaking = undefined;
        this.speech = undefined;
      } else {
        this.speech = { messageId, status: utterance.status };
      }
      this._notifySubscribers();
    });
    this.speech = { messageId, status: utterance.status };
    this._notifySubscribers();
    this._stopSpeaking = () => {
      utterance.cancel();
      unsub();
      this.speech = undefined;
      this._stopSpeaking = undefined;
    };
  }
  stopSpeaking() {
    if (!this._stopSpeaking) throw new Error("No message is being spoken");
    this._stopSpeaking();
    this._notifySubscribers();
  }
  ensureInitialized() {
    if (!this._isInitialized) {
      this._isInitialized = true;
      this._notifyEventSubscribers("initialize");
    }
  }
  export() {
    return this.repository.export();
  }
  import(data) {
    this.ensureInitialized();
    this.repository.import(data);
    this._notifySubscribers();
  }
  _eventSubscribers = /* @__PURE__ */ new Map();
  unstable_on(event, callback) {
    if (event === "model-context-update") {
      return this._contextProvider.subscribe?.(callback) ?? (() => {
      });
    }
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers) {
      this._eventSubscribers.set(event, /* @__PURE__ */ new Set([callback]));
    } else {
      subscribers.add(callback);
    }
    return () => {
      const subscribers2 = this._eventSubscribers.get(event);
      subscribers2.delete(callback);
    };
  }
};

// src/runtimes/local/shouldContinue.tsx
var shouldContinue = (result, ignoreToolNames) => result.status?.type === "requires-action" && result.status.reason === "tool-calls" && result.content.every(
  (c) => c.type !== "tool-call" || !!c.result || ignoreToolNames.includes(c.toolName)
);

// src/runtimes/local/LocalThreadRuntimeCore.tsx
var LocalThreadRuntimeCore = class extends BaseThreadRuntimeCore {
  capabilities = {
    switchToBranch: true,
    edit: true,
    reload: true,
    cancel: true,
    unstable_copy: true,
    speech: false,
    attachments: false,
    feedback: false
  };
  abortController = null;
  isDisabled = false;
  suggestions = [];
  get adapters() {
    return this._options.adapters;
  }
  constructor(contextProvider, options) {
    super(contextProvider);
    this.__internal_setOptions(options);
  }
  _options;
  _lastRunConfig = {};
  get extras() {
    return undefined;
  }
  __internal_setOptions(options) {
    if (this._options === options) return;
    this._options = options;
    let hasUpdates = false;
    const canSpeak = options.adapters?.speech !== undefined;
    if (this.capabilities.speech !== canSpeak) {
      this.capabilities.speech = canSpeak;
      hasUpdates = true;
    }
    const canAttach = options.adapters?.attachments !== undefined;
    if (this.capabilities.attachments !== canAttach) {
      this.capabilities.attachments = canAttach;
      hasUpdates = true;
    }
    const canFeedback = options.adapters?.feedback !== undefined;
    if (this.capabilities.feedback !== canFeedback) {
      this.capabilities.feedback = canFeedback;
      hasUpdates = true;
    }
    if (hasUpdates) this._notifySubscribers();
  }
  async append(message) {
    this.ensureInitialized();
    const newMessage = fromCoreMessage(message, {
      attachments: message.attachments
    });
    this.repository.addOrUpdateMessage(message.parentId, newMessage);
    const startRun = message.startRun ?? message.role === "user";
    if (startRun) {
      await this.startRun({
        parentId: newMessage.id,
        sourceId: message.sourceId,
        runConfig: message.runConfig ?? {}
      });
    } else {
      this.repository.resetHead(newMessage.id);
      this._notifySubscribers();
    }
  }
  async startRun({
    parentId,
    runConfig
  }) {
    this.ensureInitialized();
    this.repository.resetHead(parentId);
    const id = generateId();
    let message = {
      id,
      role: "assistant",
      status: { type: "running" },
      content: [],
      metadata: {
        unstable_annotations: [],
        unstable_data: [],
        steps: [],
        custom: {}
      },
      createdAt: /* @__PURE__ */ new Date()
    };
    this._notifyEventSubscribers("run-start");
    try {
      do {
        message = await this.performRoundtrip(parentId, message, runConfig);
      } while (shouldContinue(
        message,
        this._options.unstable_shouldContinueIgnoreToolNames ?? []
      ));
    } finally {
      this._notifyEventSubscribers("run-end");
    }
  }
  async performRoundtrip(parentId, message, runConfig) {
    const messages = this.repository.getMessages();
    this.abortController?.abort();
    this.abortController = new AbortController();
    const initialContent = message.content;
    const initialAnnotations = message.metadata?.unstable_annotations;
    const initialData = message.metadata?.unstable_data;
    const initialSteps = message.metadata?.steps;
    const initalCustom = message.metadata?.custom;
    const updateMessage = (m) => {
      const newSteps = m.metadata?.steps;
      const steps2 = newSteps ? [...initialSteps ?? [], ...newSteps] : undefined;
      const newAnnotations = m.metadata?.unstable_annotations;
      const newData = m.metadata?.unstable_data;
      const annotations = newAnnotations ? [...initialAnnotations ?? [], ...newAnnotations] : undefined;
      const data = newData ? [...initialData ?? [], ...newData] : undefined;
      message = {
        ...message,
        ...m.content ? { content: [...initialContent, ...m.content ?? []] } : undefined,
        status: m.status ?? message.status,
        ...m.metadata ? {
          metadata: {
            ...message.metadata,
            ...annotations ? { unstable_annotations: annotations } : undefined,
            ...data ? { unstable_data: data } : undefined,
            ...steps2 ? { steps: steps2 } : undefined,
            ...m.metadata?.custom ? {
              custom: { ...initalCustom ?? {}, ...m.metadata.custom }
            } : undefined
          }
        } : undefined
      };
      this.repository.addOrUpdateMessage(parentId, message);
      this._notifySubscribers();
    };
    const maxSteps = this._options.maxSteps ?? 2;
    const steps = message.metadata?.steps?.length ?? 0;
    if (steps >= maxSteps) {
      updateMessage({
        status: {
          type: "incomplete",
          reason: "tool-calls"
        }
      });
      return message;
    } else {
      updateMessage({
        status: {
          type: "running"
        }
      });
    }
    try {
      this._lastRunConfig = runConfig ?? {};
      const context = this.getModelContext();
      const promiseOrGenerator = this.adapters.chatModel.run({
        messages,
        runConfig: this._lastRunConfig,
        abortSignal: this.abortController.signal,
        context,
        config: context,
        unstable_assistantMessageId: message.id
      });
      if (Symbol.asyncIterator in promiseOrGenerator) {
        for await (const r of promiseOrGenerator) {
          updateMessage(r);
        }
      } else {
        updateMessage(await promiseOrGenerator);
      }
      this.abortController = null;
      if (message.status.type === "running") {
        updateMessage({
          status: { type: "complete", reason: "unknown" }
        });
      }
    } catch (e) {
      this.abortController = null;
      if (e instanceof Error && e.name === "AbortError") {
        updateMessage({
          status: { type: "incomplete", reason: "cancelled" }
        });
      } else {
        updateMessage({
          status: { type: "incomplete", reason: "error", error: e }
        });
        throw e;
      }
    }
    return message;
  }
  cancelRun() {
    this.abortController?.abort();
    this.abortController = null;
  }
  addToolResult({
    messageId,
    toolCallId,
    result
  }) {
    const messageData = this.repository.getMessage(messageId);
    const { parentId } = messageData;
    let { message } = messageData;
    if (message.role !== "assistant")
      throw new Error("Tried to add tool result to non-assistant message");
    let added = false;
    let found = false;
    const newContent = message.content.map((c) => {
      if (c.type !== "tool-call") return c;
      if (c.toolCallId !== toolCallId) return c;
      found = true;
      if (!c.result) added = true;
      return {
        ...c,
        result
      };
    });
    if (!found)
      throw new Error("Tried to add tool result to non-existing tool call");
    message = {
      ...message,
      content: newContent
    };
    this.repository.addOrUpdateMessage(parentId, message);
    if (added && shouldContinue(
      message,
      this._options.unstable_shouldContinueIgnoreToolNames ?? []
    )) {
      this.performRoundtrip(parentId, message, this._lastRunConfig);
    }
  }
};

// src/runtimes/local/LocalThreadListRuntimeCore.tsx
var RESOLVED_PROMISE = Promise.resolve();
var LocalThreadListRuntimeCore = class {
  constructor(_threadFactory) {
    this._threadFactory = _threadFactory;
    this.switchToNewThread();
  }
  _threadData = /* @__PURE__ */ new Map();
  _threadIds = [];
  _archivedThreadIds = [];
  _newThreadId;
  get newThreadId() {
    return this._newThreadId;
  }
  get threadIds() {
    return this._threadIds;
  }
  get archivedThreadIds() {
    return this._archivedThreadIds;
  }
  _mainThreadId;
  get mainThreadId() {
    return this._mainThreadId;
  }
  getMainThreadRuntimeCore() {
    const result = this._threadData.get(this._mainThreadId)?.runtime;
    if (!result)
      throw new Error("Main thread not found. This is a bug in assistant-ui.");
    return result;
  }
  getThreadRuntimeCore(threadId) {
    const result = this._threadData.get(threadId)?.runtime;
    if (!result) throw new Error("Thread not found.");
    return result;
  }
  getLoadThreadsPromise() {
    return RESOLVED_PROMISE;
  }
  getItemById(threadId) {
    return this._threadData.get(threadId);
  }
  async switchToThread(threadId) {
    if (this._mainThreadId === threadId) return;
    const data = this._threadData.get(threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status === "archived") await this.unarchive(threadId);
    this._mainThreadId = data.threadId;
    this._notifySubscribers();
  }
  switchToNewThread() {
    if (this._newThreadId === undefined) {
      let threadId;
      do {
        threadId = generateId();
      } while (this._threadData.has(threadId));
      const runtime = this._threadFactory();
      const dispose = runtime.unstable_on("initialize", () => {
        dispose();
        const data = this._threadData.get(threadId);
        if (!data) throw new Error("Thread not found");
        this._stateOp(threadId, "regular");
      });
      this._threadData.set(threadId, {
        runtime,
        status: "new",
        threadId
      });
      this._newThreadId = threadId;
    }
    this.switchToThread(this._newThreadId);
    return Promise.resolve();
  }
  async _stateOp(threadId, newState) {
    const data = this._threadData.get(threadId);
    if (!data) throw new Error("Thread not found");
    const { status: lastState } = data;
    if (lastState === newState) return;
    switch (lastState) {
      case "new":
        this._newThreadId = undefined;
        break;
      case "regular":
        this._threadIds = this._threadIds.filter((t) => t !== threadId);
        break;
      case "archived":
        this._archivedThreadIds = this._archivedThreadIds.filter(
          (t) => t !== threadId
        );
        break;
      default: {
        const _exhaustiveCheck = lastState;
        throw new Error(`Unsupported state: ${_exhaustiveCheck}`);
      }
    }
    switch (newState) {
      case "regular":
        this._threadIds = [data.threadId, ...this._threadIds];
        break;
      case "archived":
        this._archivedThreadIds = [data.threadId, ...this._archivedThreadIds];
        break;
      case "deleted":
        this._threadData.delete(threadId);
        break;
      default: {
        const _exhaustiveCheck = newState;
        throw new Error(`Unsupported state: ${_exhaustiveCheck}`);
      }
    }
    if (newState !== "deleted") {
      this._threadData.set(threadId, {
        ...data,
        status: newState
      });
    }
    if (threadId === this._mainThreadId && (newState === "archived" || newState === "deleted")) {
      const lastThreadId = this._threadIds[0];
      if (lastThreadId) {
        await this.switchToThread(lastThreadId);
      } else {
        await this.switchToNewThread();
      }
    } else {
      this._notifySubscribers();
    }
  }
  rename(threadId, newTitle) {
    const data = this._threadData.get(threadId);
    if (!data) throw new Error("Thread not found");
    this._threadData.set(threadId, {
      ...data,
      title: newTitle
    });
    this._notifySubscribers();
    return Promise.resolve();
  }
  archive(threadId) {
    const data = this._threadData.get(threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status !== "regular")
      throw new Error("Thread is not yet initialized or already archived");
    this._stateOp(threadId, "archived");
    return Promise.resolve();
  }
  unarchive(threadId) {
    const data = this._threadData.get(threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status !== "archived") throw new Error("Thread is not archived");
    this._stateOp(threadId, "regular");
    return Promise.resolve();
  }
  delete(threadId) {
    const data = this._threadData.get(threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status !== "regular" && data.status !== "archived")
      throw new Error("Thread is not yet initialized");
    this._stateOp(threadId, "deleted");
    return Promise.resolve();
  }
  initialize() {
    throw new Error("Method not implemented.");
  }
  _subscriptions = /* @__PURE__ */ new Set();
  subscribe(callback) {
    this._subscriptions.add(callback);
    return () => this._subscriptions.delete(callback);
  }
  _notifySubscribers() {
    for (const callback of this._subscriptions) callback();
  }
};

// src/runtimes/local/LocalRuntimeCore.tsx
var getExportFromInitialMessages = (initialMessages) => {
  const messages = initialMessages.map((i, idx) => {
    const isLast = idx === initialMessages.length - 1;
    return fromThreadMessageLike(i, generateId(), getAutoStatus(isLast, false));
  });
  return {
    messages: messages.map((m, idx) => ({
      parentId: messages[idx - 1]?.id ?? null,
      message: m
    }))
  };
};
var LocalRuntimeCore = class extends BaseAssistantRuntimeCore {
  threads;
  Provider = undefined;
  _options;
  constructor(options, initialMessages) {
    super();
    this._options = options;
    this.threads = new LocalThreadListRuntimeCore(() => {
      return new LocalThreadRuntimeCore(this._contextProvider, this._options);
    });
    if (initialMessages) {
      this.threads.getMainThreadRuntimeCore().import(getExportFromInitialMessages(initialMessages));
    }
  }
  reset({
    initialMessages
  } = {}) {
    this.threads.switchToNewThread();
    if (!initialMessages) return;
    this.threads.getMainThreadRuntimeCore().import(getExportFromInitialMessages(initialMessages));
  }
};

var LocalRuntimeImpl = class _LocalRuntimeImpl extends AssistantRuntimeImpl {
  constructor(core) {
    super(core, ThreadRuntimeImpl);
    this.core = core;
  }
  __internal_bindMethods() {
    super.__internal_bindMethods();
    this.reset = this.reset.bind(this);
  }
  reset(options) {
    this.core.reset(options);
  }
  static create(_core) {
    return new _LocalRuntimeImpl(_core);
  }
};
var useLocalRuntime = (adapter, { initialMessages, ...options } = {}) => {
  const opt = {
    ...options,
    adapters: {
      ...options.adapters,
      chatModel: adapter
    }
  };
  const [runtime] = useState(() => new LocalRuntimeCore(opt, initialMessages));
  useEffect(() => {
    runtime.threads.getMainThreadRuntimeCore().__internal_setOptions(opt);
  }, [runtime, opt]);
  return useMemo(() => LocalRuntimeImpl.create(runtime), [runtime]);
};

var ThreadConfigContext = createContext({});
var useThreadConfig = () => {
  return useContext(ThreadConfigContext);
};
var ThreadConfigProvider = ({
  children,
  config
}) => {
  const hasAssistant = !!useAssistantRuntime({ optional: true });
  const hasConfig = config && Object.keys(config).length > 0;
  const outerConfig = useThreadConfig();
  if (hasConfig && Object.keys(outerConfig).length > 0) {
    throw new Error(
      "You are providing ThreadConfig to several nested components. Please provide all configuration to the same component."
    );
  }
  const configProvider = hasConfig ? /* @__PURE__ */ jsx(ThreadConfigContext.Provider, { value: config, children }) : /* @__PURE__ */ jsx(Fragment, { children });
  if (!config?.runtime) return configProvider;
  if (hasAssistant) {
    throw new Error(
      "You provided a runtime to <Thread> while simulataneously using <AssistantRuntimeProvider>. This is not allowed."
    );
  }
  return /* @__PURE__ */ jsx(AssistantRuntimeProvider, { runtime: config.runtime, children: configProvider });
};
ThreadConfigProvider.displayName = "ThreadConfigProvider";

var useAllowCopy = (ensureCapability = false) => {
  const { assistantMessage: { allowCopy = true } = {} } = useThreadConfig();
  const copySupported = useThread((t) => t.capabilities.unstable_copy);
  return allowCopy && (!ensureCapability || copySupported);
};
var useAllowSpeak = (ensureCapability = false) => {
  const { assistantMessage: { allowSpeak = true } = {} } = useThreadConfig();
  const speechSupported = useThread((t) => t.capabilities.speech);
  return allowSpeak && (!ensureCapability || speechSupported);
};
var useAllowReload = (ensureCapability = false) => {
  const { assistantMessage: { allowReload = true } = {} } = useThreadConfig();
  const reloadSupported = useThread((t) => t.capabilities.reload);
  return allowReload && (!ensureCapability || reloadSupported);
};
var useAllowFeedbackPositive = (ensureCapability = false) => {
  const { assistantMessage: { allowFeedbackPositive = true } = {} } = useThreadConfig();
  const feedbackSupported = useThread((t) => t.capabilities.feedback);
  return allowFeedbackPositive && (!ensureCapability || feedbackSupported);
};
var useAllowFeedbackNegative = (ensureCapability = false) => {
  const { assistantMessage: { allowFeedbackNegative = true } = {} } = useThreadConfig();
  const feedbackSupported = useThread((t) => t.capabilities.feedback);
  return allowFeedbackNegative && (!ensureCapability || feedbackSupported);
};
var AssistantActionBar = () => {
  const allowCopy = useAllowCopy(true);
  const allowReload = useAllowReload(true);
  const allowSpeak = useAllowSpeak(true);
  const allowFeedbackPositive = useAllowFeedbackPositive(true);
  const allowFeedbackNegative = useAllowFeedbackNegative(true);
  if (!allowCopy && !allowReload && !allowSpeak && !allowFeedbackPositive && !allowFeedbackNegative)
    return null;
  return /* @__PURE__ */ jsxs(
    AssistantActionBarRoot,
    {
      hideWhenRunning: true,
      autohide: "not-last",
      autohideFloat: "single-branch",
      children: [
        allowSpeak && /* @__PURE__ */ jsx(AssistantActionBarSpeechControl, {}),
        allowCopy && /* @__PURE__ */ jsx(AssistantActionBarCopy, {}),
        allowReload && /* @__PURE__ */ jsx(AssistantActionBarReload, {}),
        allowFeedbackPositive && /* @__PURE__ */ jsx(AssistantActionBarFeedbackPositive, {}),
        allowFeedbackNegative && /* @__PURE__ */ jsx(AssistantActionBarFeedbackNegative, {})
      ]
    }
  );
};
AssistantActionBar.displayName = "AssistantActionBar";
var AssistantActionBarRoot = withDefaults(ActionBarPrimitiveRoot, {
  className: "aui-assistant-action-bar-root"
});
AssistantActionBarRoot.displayName = "AssistantActionBarRoot";
var AssistantActionBarCopy = forwardRef(({ copiedDuration, ...props }, ref) => {
  const {
    strings: {
      assistantMessage: { copy: { tooltip = "Copy" } = {} } = {}
    } = {}
  } = useThreadConfig();
  return /* @__PURE__ */ jsx(ActionBarPrimitiveCopy, { copiedDuration, asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MessagePrimitiveIf, { copied: true, children: /* @__PURE__ */ jsx(CheckIcon, {}) }),
    /* @__PURE__ */ jsx(MessagePrimitiveIf, { copied: false, children: /* @__PURE__ */ jsx(CopyIcon, {}) })
  ] }) }) });
});
AssistantActionBarCopy.displayName = "AssistantActionBarCopy";
var AssistantActionBarSpeechControl = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MessagePrimitiveIf, { speaking: false, children: /* @__PURE__ */ jsx(AssistantActionBarSpeak, {}) }),
    /* @__PURE__ */ jsx(MessagePrimitiveIf, { speaking: true, children: /* @__PURE__ */ jsx(AssistantActionBarStopSpeaking, {}) })
  ] });
};
var AssistantActionBarSpeak = forwardRef((props, ref) => {
  const {
    strings: {
      assistantMessage: { speak: { tooltip = "Read aloud" } = {} } = {}
    } = {}
  } = useThreadConfig();
  const allowSpeak = useAllowSpeak();
  return /* @__PURE__ */ jsx(ActionBarPrimitiveSpeak, { disabled: !allowSpeak, asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(AudioLinesIcon, {}) }) });
});
AssistantActionBarSpeak.displayName = "AssistantActionBarSpeak";
var AssistantActionBarStopSpeaking = forwardRef((props, ref) => {
  const {
    strings: {
      assistantMessage: {
        speak: { stop: { tooltip: stopTooltip = "Stop" } = {} } = {}
      } = {}
    } = {}
  } = useThreadConfig();
  const allowSpeak = useAllowSpeak();
  return /* @__PURE__ */ jsx(ActionBarPrimitiveStopSpeaking, { disabled: !allowSpeak, asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: stopTooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(StopCircleIcon, {}) }) });
});
AssistantActionBarStopSpeaking.displayName = "AssistantActionBarStopSpeaking";
var AssistantActionBarReload = forwardRef((props, ref) => {
  const {
    strings: {
      assistantMessage: { reload: { tooltip = "Refresh" } = {} } = {}
    } = {}
  } = useThreadConfig();
  const allowReload = useAllowReload();
  return /* @__PURE__ */ jsx(ActionBarPrimitiveReload, { disabled: !allowReload, asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(RefreshCwIcon, {}) }) });
});
AssistantActionBarReload.displayName = "AssistantActionBarReload";
var AssistantActionBarFeedbackPositive = forwardRef((props, ref) => {
  const {
    strings: {
      assistantMessage: {
        feedback: { positive: { tooltip = "Good response" } = {} } = {}
      } = {}
    } = {}
  } = useThreadConfig();
  const allowFeedbackPositive = useAllowFeedbackPositive();
  return /* @__PURE__ */ jsx(
    ActionBarPrimitiveFeedbackPositive,
    {
      disabled: !allowFeedbackPositive,
      className: "aui-assistant-action-bar-feedback-positive",
      asChild: true,
      children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(ThumbsUpIcon, {}) })
    }
  );
});
AssistantActionBarFeedbackPositive.displayName = "AssistantActionBarFeedbackPositive";
var AssistantActionBarFeedbackNegative = forwardRef((props, ref) => {
  const {
    strings: {
      assistantMessage: {
        feedback: { negative: { tooltip = "Bad response" } = {} } = {}
      } = {}
    } = {}
  } = useThreadConfig();
  const allowFeedbackNegative = useAllowFeedbackNegative();
  return /* @__PURE__ */ jsx(
    ActionBarPrimitiveFeedbackNegative,
    {
      disabled: !allowFeedbackNegative,
      className: "aui-assistant-action-bar-feedback-negative",
      asChild: true,
      children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(ThumbsDownIcon, {}) })
    }
  );
});
AssistantActionBarFeedbackNegative.displayName = "AssistantActionBarFeedbackNegative";
var exports$b = {
  Root: AssistantActionBarRoot,
  Reload: AssistantActionBarReload,
  Copy: AssistantActionBarCopy,
  Speak: AssistantActionBarSpeak,
  StopSpeaking: AssistantActionBarStopSpeaking,
  SpeechControl: AssistantActionBarSpeechControl,
  FeedbackPositive: AssistantActionBarFeedbackPositive,
  FeedbackNegative: AssistantActionBarFeedbackNegative
};
var assistant_action_bar_default = Object.assign(
  AssistantActionBar,
  exports$b
);

var useAllowBranchPicker = (ensureCapability = false) => {
  const { branchPicker: { allowBranchPicker = true } = {} } = useThreadConfig();
  const branchPickerSupported = useThread((t) => t.capabilities.edit);
  return allowBranchPicker && (!ensureCapability || branchPickerSupported);
};
var BranchPicker = () => {
  const allowBranchPicker = useAllowBranchPicker(true);
  if (!allowBranchPicker) return null;
  return /* @__PURE__ */ jsxs(BranchPickerRoot, { hideWhenSingleBranch: true, children: [
    /* @__PURE__ */ jsx(BranchPickerPrevious, {}),
    /* @__PURE__ */ jsx(BranchPickerState, {}),
    /* @__PURE__ */ jsx(BranchPickerNext, {})
  ] });
};
BranchPicker.displayName = "BranchPicker";
var BranchPickerRoot = withDefaults(BranchPickerPrimitiveRoot, {
  className: "aui-branch-picker-root"
});
BranchPickerRoot.displayName = "BranchPickerRoot";
var BranchPickerPrevious = forwardRef((props, ref) => {
  const {
    strings: {
      branchPicker: { previous: { tooltip = "Previous" } = {} } = {}
    } = {}
  } = useThreadConfig();
  const allowBranchPicker = useAllowBranchPicker();
  return /* @__PURE__ */ jsx(BranchPickerPrimitivePrevious, { disabled: !allowBranchPicker, asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(ChevronLeftIcon, {}) }) });
});
BranchPickerPrevious.displayName = "BranchPickerPrevious";
var BranchPickerStateWrapper = withDefaults("span", {
  className: "aui-branch-picker-state"
});
var BranchPickerState = forwardRef((props, ref) => {
  return /* @__PURE__ */ jsxs(BranchPickerStateWrapper, { ...props, ref, children: [
    /* @__PURE__ */ jsx(BranchPickerPrimitiveNumber, {}),
    " / ",
    /* @__PURE__ */ jsx(BranchPickerPrimitiveCount, {})
  ] });
});
BranchPickerState.displayName = "BranchPickerState";
var BranchPickerNext = forwardRef((props, ref) => {
  const {
    strings: { branchPicker: { next: { tooltip = "Next" } = {} } = {} } = {}
  } = useThreadConfig();
  const allowBranchPicker = useAllowBranchPicker();
  return /* @__PURE__ */ jsx(BranchPickerPrimitiveNext, { disabled: !allowBranchPicker, asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(ChevronRightIcon, {}) }) });
});
BranchPickerNext.displayName = "BranchPickerNext";
var exports$a = {
  Root: BranchPickerRoot,
  Previous: BranchPickerPrevious,
  Next: BranchPickerNext
};
var branch_picker_default = Object.assign(BranchPicker, exports$a);

// src/ui/base/avatar.tsx
var Avatar = ({ src, alt, fallback }) => {
  if (src == null && fallback == null) return null;
  return /* @__PURE__ */ jsxs(AvatarRoot, { children: [
    src != null && /* @__PURE__ */ jsx(AvatarImage, { src, alt }),
    fallback != null && /* @__PURE__ */ jsx(AvatarFallback, { children: fallback })
  ] });
};
Avatar.displayName = "Avatar";
var AvatarRoot = withDefaults(AvatarPrimitive.Root, {
  className: "aui-avatar-root"
});
AvatarRoot.displayName = "AvatarRoot";
var AvatarImage = withDefaults(AvatarPrimitive.Image, {
  className: "aui-avatar-image"
});
AvatarImage.displayName = "AvatarImage";
var AvatarFallback = withDefaults(AvatarPrimitive.Fallback, {
  className: "aui-avatar-fallback"
});
AvatarFallback.displayName = "AvatarFallback";

var Text = () => {
  const status = useSmoothStatus();
  return /* @__PURE__ */ jsx(
    ContentPartPrimitiveText,
    {
      className: classNames(
        "aui-text",
        status.type === "running" && "aui-text-running"
      ),
      component: "p"
    }
  );
};
var exports$9 = { Text: withSmoothContextProvider(Text) };
var content_part_default = exports$9;

var AssistantMessage = () => {
  return /* @__PURE__ */ jsxs(AssistantMessageRoot, { children: [
    /* @__PURE__ */ jsx(AssistantMessageAvatar, {}),
    /* @__PURE__ */ jsx(AssistantMessageContent, {}),
    /* @__PURE__ */ jsx(branch_picker_default, {}),
    /* @__PURE__ */ jsx(assistant_action_bar_default, {})
  ] });
};
AssistantMessage.displayName = "AssistantMessage";
var AssistantMessageAvatar = () => {
  const { assistantAvatar: avatar = { fallback: "A" } } = useThreadConfig();
  return /* @__PURE__ */ jsx(Avatar, { ...avatar });
};
var AssistantMessageRoot = withDefaults(MessagePrimitiveRoot, {
  className: "aui-assistant-message-root"
});
AssistantMessageRoot.displayName = "AssistantMessageRoot";
var AssistantMessageContentWrapper = withDefaults("div", {
  className: "aui-assistant-message-content"
});
var AssistantMessageContent = forwardRef(({ components: componentsProp, ...rest }, ref) => {
  const { tools, assistantMessage: { components = {} } = {} } = useThreadConfig();
  const toolsComponents = useMemo(
    () => ({
      by_name: !tools ? undefined : Object.fromEntries(
        tools.map((t) => [
          t.unstable_tool.toolName,
          t.unstable_tool.render
        ])
      ),
      Fallback: components.ToolFallback
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...tools ?? [], components.ToolFallback]
  );
  const Footer = components.Footer;
  return /* @__PURE__ */ jsxs(AssistantMessageContentWrapper, { ...rest, ref, children: [
    /* @__PURE__ */ jsx(
      MessagePrimitiveContent,
      {
        components: {
          ...componentsProp,
          Text: componentsProp?.Text ?? components.Text ?? content_part_default.Text,
          Empty: componentsProp?.Empty ?? components.Empty,
          tools: toolsComponents
        }
      }
    ),
    Footer && /* @__PURE__ */ jsx(Footer, {})
  ] });
});
AssistantMessageContent.displayName = "AssistantMessageContent";
var exports$8 = {
  Root: AssistantMessageRoot,
  Avatar: AssistantMessageAvatar,
  Content: AssistantMessageContent
};
var assistant_message_default = Object.assign(
  AssistantMessage,
  exports$8
);

// src/ui/base/CircleStopIcon.tsx
var CircleStopIcon = () => {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      fill: "currentColor",
      width: "16",
      height: "16",
      children: /* @__PURE__ */ jsx("rect", { width: "10", height: "10", x: "3", y: "3", rx: "2" })
    }
  );
};
CircleStopIcon.displayName = "CircleStopIcon";

// src/ui/base/dialog.tsx
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: classNames("aui-dialog-overlay", className),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsx(
    DialogPrimitive.Content,
    {
      ref,
      className: classNames("aui-dialog-content", className),
      ...props,
      children
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const isIterable = (obj) => Symbol.iterator in obj;
const hasIterableEntries = (value) => (
  // HACK: avoid checking entries type
  "entries" in value
);
const compareEntries = (valueA, valueB) => {
  const mapA = valueA instanceof Map ? valueA : new Map(valueA.entries());
  const mapB = valueB instanceof Map ? valueB : new Map(valueB.entries());
  if (mapA.size !== mapB.size) {
    return false;
  }
  for (const [key, value] of mapA) {
    if (!Object.is(value, mapB.get(key))) {
      return false;
    }
  }
  return true;
};
const compareIterables = (valueA, valueB) => {
  const iteratorA = valueA[Symbol.iterator]();
  const iteratorB = valueB[Symbol.iterator]();
  let nextA = iteratorA.next();
  let nextB = iteratorB.next();
  while (!nextA.done && !nextB.done) {
    if (!Object.is(nextA.value, nextB.value)) {
      return false;
    }
    nextA = iteratorA.next();
    nextB = iteratorB.next();
  }
  return !!nextA.done && !!nextB.done;
};
function shallow(valueA, valueB) {
  if (Object.is(valueA, valueB)) {
    return true;
  }
  if (typeof valueA !== "object" || valueA === null || typeof valueB !== "object" || valueB === null) {
    return false;
  }
  if (!isIterable(valueA) || !isIterable(valueB)) {
    return compareEntries(
      { entries: () => Object.entries(valueA) },
      { entries: () => Object.entries(valueB) }
    );
  }
  if (hasIterableEntries(valueA) && hasIterableEntries(valueB)) {
    return compareEntries(valueA, valueB);
  }
  return compareIterables(valueA, valueB);
}

function useShallow(selector) {
  const prev = React__default.useRef(undefined);
  return (state) => {
    const next = selector(state);
    return shallow(prev.current, next) ? prev.current : prev.current = next;
  };
}

var AttachmentRoot = withDefaults(AttachmentPrimitiveRoot, {
  className: "aui-attachment-root"
});
var AttachmentContent = withDefaults("div", {
  className: "aui-attachment-content"
});
AttachmentRoot.displayName = "AttachmentRoot";
var useFileSrc = (file) => {
  const [src, setSrc] = useState(undefined);
  useEffect(() => {
    if (!file) {
      setSrc(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);
  return src;
};
var useAttachmentSrc = () => {
  const { file, src } = useAttachment(
    useShallow((a) => {
      if (a.type !== "image") return {};
      if (a.file) return { file: a.file };
      const src2 = a.content?.filter((c) => c.type === "image")[0]?.image;
      if (!src2) return {};
      return { src: src2 };
    })
  );
  return useFileSrc(file) ?? src;
};
var AttachmentPreview = ({ src }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    /* @__PURE__ */ jsx(
      "img",
      {
        src,
        style: {
          width: "auto",
          height: "auto",
          maxWidth: "75dvh",
          maxHeight: "75dvh",
          display: isLoaded ? "block" : "none",
          overflow: "clip"
        },
        onLoad: () => setIsLoaded(true),
        alt: "Image Preview"
      }
    )
  );
};
var AttachmentPreviewDialog = ({ children }) => {
  const src = useAttachmentSrc();
  if (!src) return children;
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogTrigger, { className: "aui-attachment-preview-trigger", asChild: true, children }),
    /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { className: "aui-sr-only", children: "Image Attachment Preview" }),
      /* @__PURE__ */ jsx(AttachmentPreview, { src })
    ] })
  ] });
};
var AttachmentThumb = () => {
  const isImage = useAttachment((a) => a.type === "image");
  const src = useAttachmentSrc();
  return /* @__PURE__ */ jsxs(AvatarRoot, { className: "aui-attachment-thumb", children: [
    /* @__PURE__ */ jsx(AvatarFallback$1, { delayMs: isImage ? 200 : 0, children: /* @__PURE__ */ jsx(FileIcon, {}) }),
    /* @__PURE__ */ jsx(AvatarImage, { src })
  ] });
};
var AttachmentUI = () => {
  const canRemove = useAttachment((a) => a.source !== "message");
  const typeLabel = useAttachment((a) => {
    const type = a.type;
    switch (type) {
      case "image":
        return "Image";
      case "document":
        return "Document";
      case "file":
        return "File";
      default:
        const _exhaustiveCheck = type;
        throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
    }
  });
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsxs(AttachmentRoot, { children: [
      /* @__PURE__ */ jsx(AttachmentPreviewDialog, { children: /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(AttachmentContent, { children: [
        /* @__PURE__ */ jsx(AttachmentThumb, {}),
        /* @__PURE__ */ jsxs("div", { className: "aui-attachment-text", children: [
          /* @__PURE__ */ jsx("p", { className: "aui-attachment-name", children: /* @__PURE__ */ jsx(AttachmentPrimitiveName, {}) }),
          /* @__PURE__ */ jsx("p", { className: "aui-attachment-type", children: typeLabel })
        ] })
      ] }) }) }),
      canRemove && /* @__PURE__ */ jsx(AttachmentRemove, {})
    ] }),
    /* @__PURE__ */ jsx(TooltipContent, { side: "top", children: /* @__PURE__ */ jsx(AttachmentPrimitiveName, {}) })
  ] });
};
AttachmentUI.displayName = "Attachment";
var AttachmentRemove = forwardRef((props, ref) => {
  const {
    strings: {
      composer: { removeAttachment: { tooltip = "Remove file" } = {} } = {}
    } = {}
  } = useThreadConfig();
  return /* @__PURE__ */ jsx(AttachmentPrimitiveRemove, { asChild: true, children: /* @__PURE__ */ jsx(
    TooltipIconButton,
    {
      tooltip,
      className: "aui-attachment-remove",
      side: "top",
      ...props,
      ref,
      children: props.children ?? /* @__PURE__ */ jsx(CircleXIcon, {})
    }
  ) });
});
AttachmentRemove.displayName = "AttachmentRemove";
var exports$7 = {
  Root: AttachmentRoot,
  Remove: AttachmentRemove
};
var attachment_ui_default = Object.assign(AttachmentUI, exports$7);

var useAllowAttachments = (ensureCapability = false) => {
  const { composer: { allowAttachments = true } = {} } = useThreadConfig();
  const attachmentsSupported = useThread((t) => t.capabilities.attachments);
  return allowAttachments && (!ensureCapability || attachmentsSupported);
};
var Composer = () => {
  const allowAttachments = useAllowAttachments(true);
  return /* @__PURE__ */ jsxs(ComposerRoot, { children: [
    allowAttachments && /* @__PURE__ */ jsx(ComposerAttachments, {}),
    allowAttachments && /* @__PURE__ */ jsx(ComposerAddAttachment, {}),
    /* @__PURE__ */ jsx(ComposerInput, { autoFocus: true }),
    /* @__PURE__ */ jsx(ComposerAction, {})
  ] });
};
Composer.displayName = "Composer";
var ComposerRoot = withDefaults(ComposerPrimitiveRoot, {
  className: "aui-composer-root"
});
ComposerRoot.displayName = "ComposerRoot";
var ComposerInputStyled = withDefaults(ComposerPrimitiveInput, {
  rows: 1,
  autoFocus: true,
  className: "aui-composer-input"
});
var ComposerInput = forwardRef(
  (props, ref) => {
    const {
      strings: {
        composer: { input: { placeholder = "Write a message..." } = {} } = {}
      } = {}
    } = useThreadConfig();
    return /* @__PURE__ */ jsx(ComposerInputStyled, { placeholder, ...props, ref });
  }
);
ComposerInput.displayName = "ComposerInput";
var ComposerAttachmentsContainer = withDefaults("div", {
  className: "aui-composer-attachments"
});
var ComposerAttachments = ({ components }) => {
  return /* @__PURE__ */ jsx(ComposerAttachmentsContainer, { children: /* @__PURE__ */ jsx(
    ComposerPrimitiveAttachments,
    {
      components: {
        ...components,
        Attachment: components?.Attachment ?? attachment_ui_default
      }
    }
  ) });
};
var ComposerAttachButton = withDefaults(TooltipIconButton, {
  variant: "default",
  className: "aui-composer-attach"
});
var ComposerAddAttachment = forwardRef((props, ref) => {
  const {
    strings: {
      composer: { addAttachment: { tooltip = "Attach file" } = {} } = {}
    } = {}
  } = useThreadConfig();
  const allowAttachments = useAllowAttachments();
  return /* @__PURE__ */ jsx(ComposerPrimitiveAddAttachment, { disabled: !allowAttachments, asChild: true, children: /* @__PURE__ */ jsx(
    ComposerAttachButton,
    {
      tooltip,
      variant: "ghost",
      ...props,
      ref,
      children: props.children ?? /* @__PURE__ */ jsx(PaperclipIcon, {})
    }
  ) });
});
ComposerAddAttachment.displayName = "ComposerAddAttachment";
var useAllowCancel = () => {
  const cancelSupported = useThread((t) => t.capabilities.cancel);
  return cancelSupported;
};
var ComposerAction = () => {
  const allowCancel = useAllowCancel();
  if (!allowCancel) return /* @__PURE__ */ jsx(ComposerSend, {});
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ThreadPrimitiveIf, { running: false, children: /* @__PURE__ */ jsx(ComposerSend, {}) }),
    /* @__PURE__ */ jsx(ThreadPrimitiveIf, { running: true, children: /* @__PURE__ */ jsx(ComposerCancel, {}) })
  ] });
};
ComposerAction.displayName = "ComposerAction";
var ComposerSendButton = withDefaults(TooltipIconButton, {
  variant: "default",
  className: "aui-composer-send"
});
var ComposerSend = forwardRef(
  (props, ref) => {
    const {
      strings: { composer: { send: { tooltip = "Send" } = {} } = {} } = {}
    } = useThreadConfig();
    return /* @__PURE__ */ jsx(ComposerPrimitiveSend, { asChild: true, children: /* @__PURE__ */ jsx(ComposerSendButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(SendHorizontalIcon, {}) }) });
  }
);
ComposerSend.displayName = "ComposerSend";
var ComposerCancelButton = withDefaults(TooltipIconButton, {
  variant: "default",
  className: "aui-composer-cancel"
});
var ComposerCancel = forwardRef(
  (props, ref) => {
    const {
      strings: { composer: { cancel: { tooltip = "Cancel" } = {} } = {} } = {}
    } = useThreadConfig();
    return /* @__PURE__ */ jsx(ComposerPrimitiveCancel, { asChild: true, children: /* @__PURE__ */ jsx(ComposerCancelButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(CircleStopIcon, {}) }) });
  }
);
ComposerCancel.displayName = "ComposerCancel";
var exports$6 = {
  Root: ComposerRoot,
  Input: ComposerInput,
  Action: ComposerAction,
  Send: ComposerSend,
  Cancel: ComposerCancel,
  AddAttachment: ComposerAddAttachment,
  Attachments: ComposerAttachments
};
var composer_default = Object.assign(Composer, exports$6);

var ThreadWelcome = () => {
  return /* @__PURE__ */ jsxs(ThreadWelcomeRoot, { children: [
    /* @__PURE__ */ jsxs(ThreadWelcomeCenter, { children: [
      /* @__PURE__ */ jsx(ThreadWelcomeAvatar, {}),
      /* @__PURE__ */ jsx(ThreadWelcomeMessage, {})
    ] }),
    /* @__PURE__ */ jsx(ThreadWelcomeSuggestions, {})
  ] });
};
ThreadWelcome.displayName = "ThreadWelcome";
var ThreadWelcomeRootStyled = withDefaults("div", {
  className: "aui-thread-welcome-root"
});
var ThreadWelcomeCenter = withDefaults("div", {
  className: "aui-thread-welcome-center"
});
var ThreadWelcomeRoot = forwardRef((props, ref) => {
  return /* @__PURE__ */ jsx(ThreadPrimitiveEmpty, { children: /* @__PURE__ */ jsx(ThreadWelcomeRootStyled, { ...props, ref }) });
});
ThreadWelcomeRoot.displayName = "ThreadWelcomeRoot";
var ThreadWelcomeAvatar = () => {
  const { assistantAvatar: avatar = { fallback: "A" } } = useThreadConfig();
  return /* @__PURE__ */ jsx(Avatar, { ...avatar });
};
var ThreadWelcomeMessageStyled = withDefaults("p", {
  className: "aui-thread-welcome-message"
});
var ThreadWelcomeMessage = forwardRef(({ message: messageProp, ...rest }, ref) => {
  const {
    welcome: { message } = {},
    strings: {
      welcome: { message: defaultMessage = "How can I help you today?" } = {}
    } = {}
  } = useThreadConfig();
  return /* @__PURE__ */ jsx(ThreadWelcomeMessageStyled, { ...rest, ref, children: messageProp ?? message ?? defaultMessage });
});
ThreadWelcomeMessage.displayName = "ThreadWelcomeMessage";
var ThreadWelcomeSuggestionContainer = withDefaults("div", {
  className: "aui-thread-welcome-suggestion-container"
});
var ThreadWelcomeSuggestionStyled = withDefaults(ThreadPrimitiveSuggestion, {
  className: "aui-thread-welcome-suggestion"
});
var ThreadWelcomeSuggestion = ({
  suggestion: { text, prompt }
}) => {
  return /* @__PURE__ */ jsx(ThreadWelcomeSuggestionStyled, { prompt, method: "replace", autoSend: true, children: /* @__PURE__ */ jsx("span", { className: "aui-thread-welcome-suggestion-text", children: text ?? prompt }) });
};
var ThreadWelcomeSuggestions = () => {
  const suggestions2 = useThread((t) => t.suggestions);
  const { welcome: { suggestions } = {} } = useThreadConfig();
  const finalSuggestions = suggestions2.length ? suggestions2 : suggestions;
  return /* @__PURE__ */ jsx(ThreadWelcomeSuggestionContainer, { children: finalSuggestions?.map((suggestion, idx) => {
    const key = `${suggestion.prompt}-${idx}`;
    return /* @__PURE__ */ jsx(ThreadWelcomeSuggestion, { suggestion }, key);
  }) });
};
ThreadWelcomeSuggestions.displayName = "ThreadWelcomeSuggestions";
var exports$5 = {
  Root: ThreadWelcomeRoot,
  Center: ThreadWelcomeCenter,
  Avatar: ThreadWelcomeAvatar,
  Message: ThreadWelcomeMessage,
  Suggestions: ThreadWelcomeSuggestions,
  Suggestion: ThreadWelcomeSuggestion
};
var thread_welcome_default = Object.assign(ThreadWelcome, exports$5);

var useAllowEdit = (ensureCapability = false) => {
  const { userMessage: { allowEdit = true } = {} } = useThreadConfig();
  const editSupported = useThread((t) => t.capabilities.edit);
  return allowEdit && (!ensureCapability || editSupported);
};
var UserActionBar = () => {
  const allowEdit = useAllowEdit(true);
  if (!allowEdit) return null;
  return /* @__PURE__ */ jsx(UserActionBarRoot, { hideWhenRunning: true, autohide: "not-last", children: /* @__PURE__ */ jsx(UserActionBarEdit, {}) });
};
UserActionBar.displayName = "UserActionBar";
var UserActionBarRoot = withDefaults(ActionBarPrimitiveRoot, {
  className: "aui-user-action-bar-root"
});
UserActionBarRoot.displayName = "UserActionBarRoot";
var UserActionBarEdit = forwardRef((props, ref) => {
  const {
    strings: { userMessage: { edit: { tooltip = "Edit" } = {} } = {} } = {}
  } = useThreadConfig();
  const allowEdit = useAllowEdit();
  return /* @__PURE__ */ jsx(ActionBarPrimitiveEdit, { disabled: !allowEdit, asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(PencilIcon, {}) }) });
});
UserActionBarEdit.displayName = "UserActionBarEdit";
var exports$4 = {
  Root: UserActionBarRoot,
  Edit: UserActionBarEdit
};
var user_action_bar_default = Object.assign(UserActionBar, exports$4);

// src/ui/user-message.tsx
var UserMessage = () => {
  return /* @__PURE__ */ jsxs(UserMessageRoot, { children: [
    /* @__PURE__ */ jsx(UserMessageAttachments, {}),
    /* @__PURE__ */ jsxs(MessagePrimitiveIf, { hasContent: true, children: [
      /* @__PURE__ */ jsx(user_action_bar_default, {}),
      /* @__PURE__ */ jsx(UserMessageContent, {})
    ] }),
    /* @__PURE__ */ jsx(branch_picker_default, {})
  ] });
};
UserMessage.displayName = "UserMessage";
var UserMessageRoot = withDefaults(MessagePrimitiveRoot, {
  className: "aui-user-message-root"
});
UserMessageRoot.displayName = "UserMessageRoot";
var UserMessageContentWrapper = withDefaults("div", {
  className: "aui-user-message-content"
});
var UserMessageContent = forwardRef(({ components, ...props }, ref) => {
  return /* @__PURE__ */ jsx(UserMessageContentWrapper, { ...props, ref, children: /* @__PURE__ */ jsx(
    MessagePrimitiveContent,
    {
      components: {
        ...components,
        Text: components?.Text ?? content_part_default.Text
      }
    }
  ) });
});
UserMessageContent.displayName = "UserMessageContent";
var UserMessageAttachmentsContainer = withDefaults("div", {
  className: "aui-user-message-attachments"
});
var UserMessageAttachments = ({
  components
}) => {
  return /* @__PURE__ */ jsx(MessagePrimitiveIf, { hasAttachments: true, children: /* @__PURE__ */ jsx(UserMessageAttachmentsContainer, { children: /* @__PURE__ */ jsx(
    MessagePrimitiveAttachments,
    {
      components: {
        ...components,
        Attachment: components?.Attachment ?? attachment_ui_default
      }
    }
  ) }) });
};
var exports$3 = {
  Root: UserMessageRoot,
  Content: UserMessageContent,
  Attachments: UserMessageAttachments
};
var user_message_default = Object.assign(UserMessage, exports$3);

var EditComposer = () => {
  return /* @__PURE__ */ jsxs(EditComposerRoot, { children: [
    /* @__PURE__ */ jsx(EditComposerInput, {}),
    /* @__PURE__ */ jsxs(EditComposerFooter, { children: [
      /* @__PURE__ */ jsx(EditComposerCancel, {}),
      /* @__PURE__ */ jsx(EditComposerSend, {})
    ] })
  ] });
};
EditComposer.displayName = "EditComposer";
var EditComposerRoot = withDefaults(ComposerPrimitiveRoot, {
  className: "aui-edit-composer-root"
});
EditComposerRoot.displayName = "EditComposerRoot";
var EditComposerInput = withDefaults(ComposerPrimitiveInput, {
  className: "aui-edit-composer-input"
});
EditComposerInput.displayName = "EditComposerInput";
var EditComposerFooter = withDefaults("div", {
  className: "aui-edit-composer-footer"
});
EditComposerFooter.displayName = "EditComposerFooter";
var EditComposerCancel = forwardRef((props, ref) => {
  const {
    strings: { editComposer: { cancel: { label = "Cancel" } = {} } = {} } = {}
  } = useThreadConfig();
  return /* @__PURE__ */ jsx(ComposerPrimitiveCancel, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", ...props, ref, children: props.children ?? label }) });
});
EditComposerCancel.displayName = "EditComposerCancel";
var EditComposerSend = forwardRef((props, ref) => {
  const {
    strings: { editComposer: { send: { label = "Send" } = {} } = {} } = {}
  } = useThreadConfig();
  return /* @__PURE__ */ jsx(ComposerPrimitiveSend, { asChild: true, children: /* @__PURE__ */ jsx(Button, { ...props, ref, children: props.children ?? label }) });
});
EditComposerSend.displayName = "EditComposerSend";
var exports$2 = {
  Root: EditComposerRoot,
  Input: EditComposerInput,
  Footer: EditComposerFooter,
  Cancel: EditComposerCancel,
  Send: EditComposerSend
};
var edit_composer_default = Object.assign(EditComposer, exports$2);

var Thread = (config) => {
  const {
    components: {
      Composer: ComposerComponent = composer_default,
      ThreadWelcome: ThreadWelcomeComponent = thread_welcome_default,
      MessagesFooter,
      ...messageComponents
    } = {}
  } = config;
  return /* @__PURE__ */ jsx(ThreadRoot, { config, children: /* @__PURE__ */ jsxs(ThreadViewport, { children: [
    /* @__PURE__ */ jsx(ThreadWelcomeComponent, {}),
    /* @__PURE__ */ jsx(
      ThreadMessages,
      {
        MessagesFooter,
        components: messageComponents
      }
    ),
    /* @__PURE__ */ jsx(ThreadFollowupSuggestions, {}),
    /* @__PURE__ */ jsxs(ThreadViewportFooter, { children: [
      /* @__PURE__ */ jsx(ThreadScrollToBottom, {}),
      /* @__PURE__ */ jsx(ComposerComponent, {})
    ] })
  ] }) });
};
var ThreadRootStyled = withDefaults(ThreadPrimitiveRoot, {
  className: "aui-root aui-thread-root"
});
var ThreadRoot = forwardRef(
  ({ config, ...props }, ref) => {
    return /* @__PURE__ */ jsx(ThreadConfigProvider, { config, children: /* @__PURE__ */ jsx(ThreadRootStyled, { ...props, ref }) });
  }
);
ThreadRoot.displayName = "ThreadRoot";
var ThreadViewport = withDefaults(ThreadPrimitiveViewport, {
  className: "aui-thread-viewport"
});
ThreadViewport.displayName = "ThreadViewport";
var ThreadViewportFooter = withDefaults("div", {
  className: "aui-thread-viewport-footer"
});
ThreadViewportFooter.displayName = "ThreadViewportFooter";
var ThreadMessages = ({
  components,
  MessagesFooter,
  unstable_flexGrowDiv: flexGrowDiv = true,
  ...rest
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ThreadPrimitiveMessages,
      {
        components: {
          ...components,
          UserMessage: components?.UserMessage ?? user_message_default,
          AssistantMessage: components?.AssistantMessage ?? assistant_message_default,
          EditComposer: components?.EditComposer ?? edit_composer_default
        },
        ...rest
      }
    ),
    MessagesFooter && /* @__PURE__ */ jsx(MessagesFooter, {}),
    flexGrowDiv && /* @__PURE__ */ jsx(ThreadPrimitiveIf, { empty: false, children: /* @__PURE__ */ jsx("div", { style: { flexGrow: 1 } }) })
  ] });
};
ThreadMessages.displayName = "ThreadMessages";
var ThreadFollowupSuggestions = () => {
  const suggestions = useThread((t) => t.suggestions);
  return /* @__PURE__ */ jsx(ThreadPrimitiveIf, { empty: false, running: false, children: /* @__PURE__ */ jsx("div", { className: "aui-thread-followup-suggestions", children: suggestions?.map((suggestion, idx) => /* @__PURE__ */ jsx(
    ThreadPrimitiveSuggestion,
    {
      className: "aui-thread-followup-suggestion",
      prompt: suggestion.prompt,
      method: "replace",
      autoSend: true,
      children: suggestion.prompt
    },
    idx
  )) }) });
};
var ThreadScrollToBottomIconButton = withDefaults(TooltipIconButton, {
  variant: "outline",
  className: "aui-thread-scroll-to-bottom"
});
var ThreadScrollToBottom = forwardRef((props, ref) => {
  const {
    strings: {
      thread: { scrollToBottom: { tooltip = "Scroll to bottom" } = {} } = {}
    } = {}
  } = useThreadConfig();
  return /* @__PURE__ */ jsx(ThreadPrimitiveScrollToBottom, { asChild: true, children: /* @__PURE__ */ jsx(ThreadScrollToBottomIconButton, { tooltip, ...props, ref, children: props.children ?? /* @__PURE__ */ jsx(ArrowDownIcon, {}) }) });
});
ThreadScrollToBottom.displayName = "ThreadScrollToBottom";
var exports$1 = {
  Root: ThreadRoot,
  Viewport: ThreadViewport,
  Messages: ThreadMessages,
  FollowupSuggestions: ThreadFollowupSuggestions,
  ScrollToBottom: ThreadScrollToBottom,
  ViewportFooter: ThreadViewportFooter
};
var thread_default = Object.assign(Thread, exports$1);

var AssistantModal = (config) => {
  return /* @__PURE__ */ jsxs(AssistantModalRoot, { config, children: [
    /* @__PURE__ */ jsx(AssistantModalTrigger, {}),
    /* @__PURE__ */ jsx(AssistantModalContent, { children: /* @__PURE__ */ jsx(thread_default, {}) })
  ] });
};
AssistantModal.displayName = "AssistantModal";
var AssistantModalRoot = ({
  config,
  ...props
}) => {
  return /* @__PURE__ */ jsx(ThreadConfigProvider, { config, children: /* @__PURE__ */ jsx(AssistantModalPrimitiveRoot, { ...props }) });
};
AssistantModalRoot.displayName = "AssistantModalRoot";
var AssistantModalTrigger = forwardRef((props, ref) => {
  return /* @__PURE__ */ jsx(AssistantModalAnchor, { children: /* @__PURE__ */ jsx(AssistantModalPrimitiveTrigger, { asChild: true, children: /* @__PURE__ */ jsx(AssistantModalButton, { ...props, ref }) }) });
});
AssistantModalTrigger.displayName = "AssistantModalTrigger";
var AssistantModalAnchor = withDefaults(AssistantModalPrimitiveAnchor, {
  className: "aui-root aui-modal-anchor"
});
AssistantModalAnchor.displayName = "AssistantModalAnchor";
var ModalButtonStyled = withDefaults(TooltipIconButton, {
  variant: "default",
  className: "aui-modal-button"
});
var AssistantModalButton = forwardRef(({ "data-state": state, ...rest }, ref) => {
  const {
    strings: {
      assistantModal: {
        open: {
          button: { tooltip: openTooltip = "Close Assistant" } = {}
        } = {},
        closed: {
          button: { tooltip: closedTooltip = "Open Assistant" } = {}
        } = {}
      } = {}
    } = {}
  } = useThreadConfig();
  const tooltip = state === "open" ? openTooltip : closedTooltip;
  return /* @__PURE__ */ jsx(
    ModalButtonStyled,
    {
      side: "left",
      tooltip,
      "data-state": state,
      ...rest,
      ref,
      children: rest.children ?? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          BotIcon,
          {
            "data-state": state,
            className: "aui-modal-button-closed-icon"
          }
        ),
        /* @__PURE__ */ jsx(
          ChevronDownIcon,
          {
            "data-state": state,
            className: "aui-modal-button-open-icon"
          }
        )
      ] })
    }
  );
});
AssistantModalButton.displayName = "AssistantModalButton";
var AssistantModalContent = withDefaults(AssistantModalPrimitiveContent, {
  className: "aui-root aui-modal-content",
  sideOffset: 16
});
AssistantModalContent.displayName = "AssistantModalContent";
var exports = {
  Root: AssistantModalRoot,
  Trigger: AssistantModalTrigger,
  Content: AssistantModalContent,
  Button: AssistantModalButton,
  Anchor: AssistantModalAnchor
};
var assistant_modal_default = Object.assign(AssistantModal, exports);

export { assistant_modal_default as a, createEdgeRuntimeAPI as c, thread_default as t, useEdgeRuntime as u };
