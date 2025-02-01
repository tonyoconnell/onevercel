
assistant-ui components are full stack components. This means that they include both the UI presentation, but also logic to communicate with an external system. This logic is handled by the runtime layer and APIs.

You interact with the runtime layer in two ways:

defining a runtime for your app
using the runtime APIs to interact with the runtime
Defining a runtime
assistant-ui ships with two low-level runtimes:

useLocalRuntime
useExternalStoreRuntime
Both of these runtimes let you implement your own runtime. The conceptual difference between the two is that useLocalRuntime takes ownership of the data layer, while useExternalStoreRuntime does not.

If you have a stateful API to integrate, use useExternalStoreRuntime, if you have a stateless API to integrate, use useLocalRuntime.

Higher level runtimes
For many services and APIs, assistant-ui provides deeper integrations. These are built with the two low-level runtimes mentioned above.

useEdgeRuntime: Connect to Vercel AI SDK backends or Edge Runtime backends
useVercelUseChatRuntime: Integrate with Vercel AI SDK's useChat hook
useVercelUseAssistantRuntime: Integrate with Vercel AI SDK's useAssistant hook (OpenAI Assistants API)
useVercelRSCRuntime: Integrate with Vercel AI SDK React Server Components
useLangGraphRuntime: Connect to LangGraph Cloud
...
Runtime Providers
The following components accept a runtime prop:

AssistantRuntimeProvider
Thread
These components put the Runtime in the React Context, so that all child components can access the runtime.

Runtime Adapters
Most runtimes accept additional adapters to configure extra integrations:

ChatModelAdapter: Configures the backend API
AttachmentAdapter: Configures the file/media attachment API
SpeechSynthesisAdapter: Configures the speech API
FeedbackAdapter: Configures the feedback API
Using the runtime APIs
The same API used by the assistant-ui components is also available to you. This allows you to build your own UI components and integrate them with the runtime layer.

Runtime Hierarchy
The runtime API is nested as such:

AssistantRuntime
ThreadListRuntime
ThreadRuntime
MessageRuntime
ContentPartRuntime (Text / Image / Audio / Tool-Call / UI)
MessageAttachmentRuntime
EditComposerRuntime
EditComposerAttachmentRuntime
ThreadComposerRuntime
ThreadComposerAttachmentRuntime
The AssistantRuntime (which encompasses everything), is sometimes simply called Runtime.

Runtime Context Provider Components
The following components provide the runtime APIs:


// provides AssistantRuntime, ThreadListRuntime, ThreadRuntime, ComposerRuntime (ThreadComposer)
<AssistantRuntimeProvider runtime={runtime} />
 
// renders every message, provides MessageRuntime, ComposerRuntime (EditComposer)
<ThreadPrimitive.Messages components={{ Message, ... }} />
 
// renders every content part, provides ContentPartRuntime
<MessagePrimitive.Content components={{ Text, Image, Audio, UI, tools }} />
 
// renders every attachment, provides AttachmentRuntime (Thread or EditComposer)
<ComposerPrimitive.Attachments components={{ Attachment, ... }} />
 
// renders every attachment, provides AtatchmentRuntime (Message)
<MessagePrimitive.Attachments components={{ Attachment, ... }} />
 
// provides a custom TextContentPartRuntime
<TextContentPartProvider text="Hello!" />
Accessing runtime APIs
You can access the runtime APIs with react hooks:


const runtime = useAssistantRuntime();
const threadRuntime = useThreadRuntime();
const messageRuntime = useMessageRuntime();
const contentPartRuntime = useContentPartRuntime();
 
// thread manager has no separate hook (1:1 relationship with assistant runtime)
const ThreadListRuntime = useAssistantRuntime().threads;
 
// composer runtime is multi-use
const composerRuntime = useComposerRuntime(); // refers to edit composer if available, otherwise thread composer
 
// thread manager has no separate hook (1:1 relationship with assistant runtime)
const threadComposer = useThreadRuntime().composer;
 
// thread manager has no separate hook (1:1 relationship with assistant runtime)
const editComposerRuntime = useMessageRuntime().composer;
 
// attachment runtime is multi-use
const attachmentRuntime = useAttachmentRuntime(); // refers to the closest attachment runtime
const threadComposerAttachmentRuntime = useThreadComposerAttachmentRuntime();
const editComposerAttachmentRuntime = useEditComposerAttachmentRuntime();
const messageAttachmentRuntime = useMessageAttachmentRuntime();
Accessing runtime state
Most runtimes also expose a state through two methods getState and subscribe. The following helper hooks subscribe to the state, so that your component is updated when the state changes:


useThreadList(); // get thread manager state
useThread(); // get thread state
useMessage(); // get message state
useContentPart(); // get content part state
useComposer(); // get composer state
useThreadComposer(); // get thread composer state
useEditComposer(); // get edit composer state
useAttachment(); // get attachment state
useThreadComposerAttachment(); // get thread composer attachment state
useEditComposerAttachment(); // get edit composer attachment state
useMessageAttachment(); // get message attachment state
You might not want to subscribe to evey update. In that case, pass a callback selector to the hook:


// only subscribe to role changes
const role = useMessage((state) => message.role);


ContentPart
Each message can have any number of content parts. Content parts are usually one of text, audio or tool-call. Additionally, image and file content parts are available, but rarely used, since these are usually included as content parts of message attachments.

Styled Components
Plain text is usually used for user messages. Markdown text is usually used for assistant messages.

Plain Text

import { ContentPart } from "@assistant/react";
 
<ContentPart.Text />;
Markdown Text

import { makeMarkdownText } from "@assistant-ui/react-markdown";
 
const MarkdownText = makeMarkdownText();
 
<MarkdownText />;
Thread Config
The <Thread /> compoonent allows customization of content part UI in the following ways:


<Thread
  tools={[MyToolUI]}
  assistantMessage={{
    components: { Text: MarkdownText, ToolFallback: MyToolFallback }
  }}
/>
Primitives
Plain Text

import { ContentPartPrimitive } from "@assistant/react";
 
<ContentPartPrimitive.Text />;
Markdown Text

import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
 
const MarkdownTextPrimitive = makeMarkdownTextPrimitive();
 
<MarkdownTextPrimitive />;
Context Provider
Content part context is provided by MessagePrimitive.Content or TextContentPartProvider

MessagePrimitive.Content

import { MessagePrimitive } from "@assistant/react";
 
<MessagePrimitive.Content
  components={{
    Text: MyText,
    Audio: MyAudio,
    tools: {
      by_name: {
        get_weather: MyWeatherToolUI,
      },
      Fallback: MyFallbackToolUI,
    },
  }}
/>;
TextContentPartProvider
This is a helper context provider to allow you to reuse the content part components outside of a message content part.


import { TextContentPartProvider } from "@assistant/react";
 
<TextContentPartProvider text="Hello world" isRunning={false}>
  <ContentPart.Text />
</TextContentPartProvider>;
Runtime API
useContentPartRuntime

import { useContentPartRuntime } from "@assistant/react";
 
const contentPartRuntime = useContentPartRuntime();
ContentPartRuntime
addToolResult:
(result: any) => void
Add tool result to a tool call content part that has no tool result yet. This is useful when you are collecting a tool result via user input ("human tool calls").

path:
ContentPartRuntimePath
getState:
() => ContentPartState
subscribe:
(callback: () => void) => Unsubscribe
useContentPart

import { useContentPart } from "@assistant/react";
 
const contentPart = useContentPart();
TextContentPartState
type:
"text"
text:
string
status:
{ readonly type: "running"; } | { readonly type: "complete"; } | { readonly type: "incomplete"; readonly reason: "length" | "cancelled" | "content-filter" | "other" | "error"; readonly error?: unknown; } | { readonly type: "requires-action"; readonly reason: "tool-calls"; }
AudioContentPartState
type:
"audio"
audio:
{ readonly data: string; readonly format: "mp3" | "wav"; }
status:
{ readonly type: "running"; } | { readonly type: "complete"; } | { readonly type: "incomplete"; readonly reason: "length" | "cancelled" | "content-filter" | "other" | "error"; readonly error?: unknown; } | { readonly type: "requires-action"; readonly reason: "tool-calls"; }
ImageContentPartState
type:
"image"
image:
string
status:
{ readonly type: "running"; } | { readonly type: "complete"; } | { readonly type: "incomplete"; readonly reason: "length" | "cancelled" | "content-filter" | "other" | "error"; readonly error?: unknown; } | { readonly type: "requires-action"; readonly reason: "tool-calls"; }
UIContentPartState
type:
"ui"
display:
React.ReactNode
status:
{ readonly type: "running"; } | { readonly type: "complete"; } | { readonly type: "incomplete"; readonly reason: "length" | "cancelled" | "content-filter" | "other" | "error"; readonly error?: unknown; } | { readonly type: "requires-action"; readonly reason: "tool-calls"; }
ToolCallContentPartState
type:
"tool-call"
toolCallId:
string
toolName:
string
args:
ReadonlyJSONObject
result?:
unknown
isError?:
boolean | undefined
argsText:
string
status:
{ readonly type: "running"; } | { readonly type: "complete"; } | { readonly type: "incomplete"; readonly reason: "length" | "cancelled" | "content-filter" | "other" | "error"; readonly error?: unknown; } | { readonly type: "requires-action"; readonly reason: "tool-calls"; }
useContentPartText

import { useContentPartText } from "@assistant/react";
 
const contentPartText = useContentPartText();
TextContentPartState
type:
"text"
text:
string
status:
{ readonly type: "running"; } | { readonly type: "complete"; } | { readonly type: "incomplete"; readonly reason: "length" | "cancelled" | "content-filter" | "other" | "error"; readonly error?: unknown; } | { readonly type: "requires-action"; readonly reason: "tool-calls"; }
Previous

Runtime API
The runtime API allows you to interact with the runtime in a standardized way. This API is used internaly by the components. You can also use it to build your own UI components or functionality.

AssistantRuntime
The AssistantRuntime is the root runtime.

useAssistantRuntime

import { useAssistantRuntime } from "@assistant-ui/react";
 
const runtime = useAssistantRuntime();
AssistantRuntime
threads:
ThreadListRuntime
The threads in this assistant.

thread:
ThreadRuntime
The currently selected main thread. Equivalent to `threads.main`.

threadList:
ThreadListRuntime
switchToNewThread:
() => void
Switch to a new thread.

switchToThread:
(threadId: string) => void
Switch to a thread.

registerModelContextProvider:
(provider: ModelContextProvider) => Unsubscribe
Register a model context provider. Model context providers are configuration such as system message, temperature, etc. that are set in the frontend.

registerModelConfigProvider:
(provider: ModelContextProvider) => Unsubscribe
Tool UI Registry
The tool UI registry is used to display custom UI for tool calls, enabling generative UI.

useToolUIs

import { useToolUIs } from "@assistant-ui/react";
 
const toolUIs = useToolUIs();
const webSearchToolUI = useToolUIs((m) => m.getToolUI("web_search"));
AssistantToolUIsState
getToolUI:
(toolName: string) => ToolCallContentPartComponent | null
Get the tool UI configured for a given tool name.

setToolUI:
(toolName: string, render: ToolCallContentPartComponent) => Unsubscribe
Registers a tool UI for a given tool name. Returns an unsubscribe function to remove the tool UI.

ThreadListRuntime
threadList

import { useAssistantRuntime } from "@assistant-ui/react";
 
const threadListRuntime = useAssistantRuntime().threadList;
ThreadListRuntime
getState:
() => ThreadListState
subscribe:
(callback: () => void) => Unsubscribe
main:
ThreadRuntime
getById:
(threadId: string) => ThreadRuntime
mainItem:
ThreadListItemRuntime
getItemById:
(threadId: string) => ThreadListItemRuntime
getItemByIndex:
(idx: number) => ThreadListItemRuntime
getArchivedItemByIndex:
(idx: number) => ThreadListItemRuntime
switchToThread:
(threadId: string) => Promise<void>
switchToNewThread:
() => Promise<void>
useThreadList

import { useThreadList } from "@assistant-ui/react";
 
const threadList = useThreadList();
const threads = useThreadList((m) => m.threads);
ThreadListItemRuntime
useThreadListItemRuntime

import { useThreadListItemRuntime } from "@assistant-ui/react";
 
const threadListItemRuntime = useThreadListItemRuntime();
ThreadListItemRuntime
path:
ThreadListItemRuntimePath
getState:
() => ThreadListItemState
initialize:
() => Promise<{ remoteId: string; externalId: string | undefined; }>
switchTo:
() => Promise<void>
rename:
(newTitle: string) => Promise<void>
archive:
() => Promise<void>
unarchive:
() => Promise<void>
delete:
() => Promise<void>
subscribe:
(callback: () => void) => Unsubscribe
unstable_on:
(event: ThreadListItemEventType, callback: () => void) => Unsubscribe
useThreadListItem

import { useThreadListItem } from "@assistant-ui/react";
 
const threadListItem = useThreadListItem();
const title = useThreadListItem((m) => m.title);
ThreadListItemState
isMain:
boolean
id:
string
remoteId:
string | undefined
externalId:
string | undefined
threadId:
string
status:
"archived" | "regular" | "new" | "deleted"
title?:
string | undefined
Thread Context
useThreadRuntime

import { useThreadRuntime } from "@assistant-ui/react";
 
const thread = useThreadRuntime();
ThreadRuntime
path:
ThreadRuntimePath
The selector for the thread runtime.

composer:
ThreadComposerRuntime
The thread composer runtime.

getState:
() => ThreadState
Gets a snapshot of the thread state.

append:
(message: CreateAppendMessage) => void
Append a new message to the thread.

startRun:
{ (parentId: string | null): void; (config: CreateStartRunConfig): void; }
subscribe:
(callback: () => void) => Unsubscribe
cancelRun:
() => void
getModelContext:
() => ModelContext
getModelConfig:
() => ModelContext
export:
() => ExportedMessageRepository
import:
(repository: ExportedMessageRepository) => void
getMesssageByIndex:
(idx: number) => MessageRuntime
getMesssageById:
(messageId: string) => MessageRuntime
stopSpeaking:
() => void
unstable_on:
(event: ThreadRuntimeEventType, callback: () => void) => Unsubscribe
useThread

import { useThread } from "@assistant-ui/react";
 
const thread = useThread();
const isRunning = useThread((m) => m.isRunning);
ThreadState
threadId:
string
The thread ID.

metadata:
ThreadListItemState
The thread metadata.

isDisabled:
boolean
Whether the thread is disabled. Disabled threads cannot receive new messages.

isRunning:
boolean
Whether the thread is running. A thread is considered running when there is an active stream connection to the backend.

capabilities:
RuntimeCapabilities
The capabilities of the thread, such as whether the thread supports editing, branch switching, etc.

messages:
readonly ThreadMessage[]
The messages in the currently selected branch of the thread.

suggestions:
readonly ThreadSuggestion[]
Follow up message suggestions to show the user.

extras:
unknown
Custom extra information provided by the runtime.

speech:
SpeechState | undefined
useThreadMessages

import { useThreadMessages } from "@assistant-ui/react";
 
const messages = useThreadMessages();
const firstMessage = useThreadMessages((m) => m[0]);
ThreadMessagesState
messages:
readonly ThreadMessage[]
The messages in the thread.

useThreadComposer

import { useThreadComposer } from "@assistant-ui/react";
 
const composer = useThreadComposer();
const text = useThreadComposer((m) => m.text);
ComposerState
text:
string
The current text of the composer.

setText:
(text: string) => void
A function to set the text of the composer.

attachments:
readonly Attachment[]
The current attachments of the composer.

addAttachment:
(attachment: Attachment) => void
A function to add an attachment to the composer.

removeAttachment:
(attachmentId: string) => void
A function to remove an attachment from the composer.

reset:
() => void
A function to reset the composer.

canCancel:
true
Whether the composer can be canceled.

isEditing:
true
Whether the composer is in edit mode.

send:
() => void
A function to send the message.

cancel:
() => void
A function to cancel the run.

focus:
() => void
A function to focus the composer.

onFocus:
(listener: () => void) => Unsubscribe
A function to subscribe to focus events.

useThreadViewport

import { useThreadViewport } from "@assistant-ui/react";
 
const threadViewport = useThreadViewport();
const isAtBottom = useThreadViewport((m) => m.isAtBottom);
ThreadViewportState
isAtBottom:
boolean
Whether the thread is at the bottom.

scrollToBottom:
() => void
A function to scroll to the bottom.

onScrollToBottom:
(callback: () => void) => Unsubscribe
A function to subscribe to scroll to bottom events.

Message Context
useMessage

import { useMessage } from "@assistant-ui/react";
 
const { message } = useMessage();
const message = useMessage((m) => m.message);
MessageState
message:
Readonly<ThreadMessage>
The current message.

parentId:
string | null
The parent message id.

branches:
readonly string[]
The branches for the message.

isLast:
boolean
Whether the message is the last in the thread.

useMessageUtils

import { useMessageUtils } from "@assistant-ui/react";
 
const messageUtils = useMessageUtils();
const isCopied = useMessageUtils((m) => m.isCopied);
MessageUtilsState
isCopied:
boolean
Whether the message is copied.

setIsCopied:
(value: boolean) => void
A function to set the is copied.

isHovering:
boolean
Whether the message is being hovered.

setIsHovering:
(value: boolean) => void
A function to set the is hovering.

isSpeaking:
boolean
Whether the message is currently being spoken.

stopSpeaking:
() => void
A function to stop the message from being spoken.

addUtterance:
(utterance: SpeechSynthesisAdapter.Utterance) => void
A function to add a speech utterance.

useEditComposer

import { useEditComposer } from "@assistant-ui/react";
 
const editComposer = useEditComposer();
const text = useEditComposer((m) => m.text);
EditComposerState
text:
string
The current text of the composer.

setText:
(text: string) => void
A function to set the text of the composer.

attachments:
readonly Attachment[]
The current attachments of the composer.

addAttachment:
(attachment: Attachment) => void
A function to add an attachment to the composer.

removeAttachment:
(attachmentId: string) => void
A function to remove an attachment from the composer.

reset:
() => void
A function to reset the composer.

canCancel:
boolean
Whether the composer can be canceled.

isEditing:
boolean
Whether the composer is in edit mode.

edit:
() => void
A function to enter edit mode.

send:
() => void
A function to send the message.

cancel:
() => void
A function to exit the edit mode.

Content Part Context
useContentPart

import { useContentPart } from "@assistant-ui/react";
 
const part = useContentPart();
const part = useContentPart.getState();
 
const status = useContentPart((m) => m.status);
const status = useContentPart.getState().status;
ContentPartState
part:
Readonly<ContentPartState>
The current content part.

status:
MessageStatus
The current content part status.

MessageStatus
type:
'running' | 'requires-action' | 'complete' | 'incomplete'
The status.

finish-reason?:
'stop' | 'cancelled' | 'length' | 'content-filter' | 'tool-calls' | 'other' | 'unknown'
The finish reason if the status is 'incomplete'.

error?:
unknown
The error object if the status is 'error'.

Composer Context
Grabs the nearest composer state (either the edit composer or the thread's new message composer).

useComposer

import { useComposer } from "@assistant-ui/react";
 
const composer = useComposer();
const text = useComposer((m) => m.text);
Attachment Context
Grabs the attachment state (either the composer or message attachment).

useAttachment

import { useAttachment } from "@assistant-ui/react";
 
const { attachment } = useAttachment();
const attachment = useAttachment((m) => m.attachment);
useComposerAttachment (Composer)

import { useComposerAttachment } from "@assistant-ui/react";
 
const { attachment } = useComposerAttachment();
const attachment = useComposerAttachment((m) => m.attachment);
ComposerAttachmentState
attachment:
ComposerAttachment
The current composer attachment.

useMessageAttachment (Message)

import { useMessageAttachment } from "@assistant-ui/react";
 
const { attachment } = useMessageAttachment();
const attachment = useMessageAttachment((m) => m.attachment);
MessageAttachmentState
attachment:
MessageAttachment
The current message attachment.

@assistant-ui/react-hook-form
A React Hook Form integration for @assistant-ui.

API Reference
useAssistantForm
Drop-in replacement hook for useForm that adds support for @assistant-ui/react.


- import { useForm } from "react-hook-form";
+ import { useAssistantForm } from "@assistant-ui/react-hook-form";
 
- useForm({
+ useAssistantForm({
    ...
  });
Properties
UseAssistantFormProps
assistant?:
object
Configuration for useAssistantForm

tools?:
object
Tools configuration for useAssistantForm

set_form_field?:
object
Configuration for the set_form_field tool

render?:
ToolCallContentPartComponent<{ name: string; value: string; }, {}>
The component to render when set_form_field is called.

submit_form?:
object
Configuration for the submit_form tool

render?:
ToolCallContentPartComponent<{}, {}>
The component to render when submit_form is called.

formTools
The set of tools to use with useAssistantForm, useful for runtimes that do not support client-side tool definitions (i.e. Vercel AI SDK).


import { formTools } from "@assistant-ui/react-hook-form";
 
const result = streamText({
  ...
  tools: {
    ...formTools,
  }
});


<AssistantRuntimeProvider />
The AssistantRuntimeProvider provides data and APIs used by assistant-ui components.

Almost all components in assistant-ui require an AssistantRuntimeProvider around them to function properly.

You must either wrap your app in an AssistantRuntimeProvider or pass a runtime to the <Thread /> component instead.


import { AssistantRuntimeProvider } from "@assistant-ui/react";
 
const MyApp = () => {
  const runtime = useEdgeRuntime({ api: "/api/chat" });
 
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {/* your app */}
    </AssistantRuntimeProvider>
  );
};
Properties
AssistantRuntimeProvider
runtime:
AssistantRuntime
The runtime to provide to the rest of your app.

children?:
React.ReactNode

Install Vercel AI SDK and @assistant-ui/react

npm install @assistant-ui/react @assistant-ui/react-ai-sdk ai @ai-sdk/openai
Setup a backend route under /api/chat
@/app/api/chat/route.ts


import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
 
export const maxDuration = 30;
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  const result = streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
  });
 
  return result.toDataStreamResponse();
}
Define a MyRuntimeProvider component
@/app/MyRuntimeProvider.tsx


"use client";
 
import { useChat } from "ai/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
 
export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chat = useChat({
    api: "/api/chat",
  });
 
  const runtime = useVercelUseChatRuntime(chat);
 
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
Wrap your app in MyRuntimeProvider
@/app/layout.tsx


import { MyRuntimeProvider } from '@/app/MyRuntimeProvider';
 
...
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MyRuntimeProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </MyRuntimeProvider>
  )
}
Accessing AI SDK Messages
You can use the getExternalStoreMessages utility to convert ThreadMessages back to Messages from AI SDK.


const MyAssistantMessage = () => {
  const aiSDKMessages = useMessage((m) => getExternalStoreMessages(m));
  // ...
};
 
const WeatherToolUI = makeAssistantToolUI({
  render: () => {
    const aiSDKMessage = useContentPart((p) => getExternalStoreMessages(p)[0]);
    // ...
  },
});

Install @assistant-ui/react

npm install @assistant-ui/react
Define a MyRuntimeProvider component
Update the MyModelAdapter below to integrate with your own custom API.

@/app/MyRuntimeProvider.tsx

"use client";
 
import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
 
const MyModelAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    // TODO replace with your own API
    const result = await fetch("<YOUR_API_ENDPOINT>", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // forward the messages in the chat to the API
      body: JSON.stringify({
        messages,
      }),
      // if the user hits the "cancel" button or escape keyboard key, cancel the request
      signal: abortSignal,
    });
 
    const data = await result.json();
    return {
      content: [
        {
          type: "text",
          text: data.text,
        },
      ],
    };
  },
};
 
export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const runtime = useLocalRuntime(MyModelAdapter);
 
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
Wrap your app in MyRuntimeProvider
@/app/layout.tsx

import type { ReactNode } from "react";
import { MyRuntimeProvider } from "@/app/MyRuntimeProvider";
 
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <MyRuntimeProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </MyRuntimeProvider>
  );
}
Streaming
Declare the run function as an AsyncGenerator (async *run). This allows you to yield the results as they are generated.

@/app/MyRuntimeProvider.tsx

const MyModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal, context }) {
    const stream = await backendApi({ messages, abortSignal, context });
 
    let text = "";
    for await (const part of stream) {
      text += part.choices[0]?.delta?.content || "";
 
      yield {
        content: [{ type: "text", text }],
      };
    }
  },
};


# Custom Rest API 
Define a MyRuntimeProvider component
Update the MyModelAdapter below to integrate with your own custom API.

@/app/MyRuntimeProvider.tsx

"use client";
 
import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
 
const MyModelAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    // TODO replace with your own API
    const result = await fetch("<YOUR_API_ENDPOINT>", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // forward the messages in the chat to the API
      body: JSON.stringify({
        messages,
      }),
      // if the user hits the "cancel" button or escape keyboard key, cancel the request
      signal: abortSignal,
    });
 
    const data = await result.json();
    return {
      content: [
        {
          type: "text",
          text: data.text,
        },
      ],
    };
  },
};
 
export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const runtime = useLocalRuntime(MyModelAdapter);
 
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
Wrap your app in MyRuntimeProvider
@/app/layout.tsx

import type { ReactNode } from "react";
import { MyRuntimeProvider } from "@/app/MyRuntimeProvider";
 
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <MyRuntimeProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </MyRuntimeProvider>
  );
}
Streaming
Declare the run function as an AsyncGenerator (async *run). This allows you to yield the results as they are generated.

@/app/MyRuntimeProvider.tsx

const MyModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal, context }) {
    const stream = await backendApi({ messages, abortSignal, context });
 
    let text = "";
    for await (const part of stream) {
      text += part.choices[0]?.delta?.content || "";
 
      yield {
        content: [{ type: "text", text }],
      };
    }
  },
};

## Use Chat Runtime
Setup a backend route under /api/chat
@/app/api/chat/route.ts


import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
 
export const maxDuration = 30;
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  const result = streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
  });
 
  return result.toDataStreamResponse();
}
Define a MyRuntimeProvider component
@/app/MyRuntimeProvider.tsx


"use client";
 
import { useChat } from "ai/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
 
export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chat = useChat({
    api: "/api/chat",
  });
 
  const runtime = useVercelUseChatRuntime(chat);
 
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
Wrap your app in MyRuntimeProvider
@/app/layout.tsx


import { MyRuntimeProvider } from '@/app/MyRuntimeProvider';
 
...
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MyRuntimeProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </MyRuntimeProvider>
  )
}
Accessing AI SDK Messages
You can use the getExternalStoreMessages utility to convert ThreadMessages back to Messages from AI SDK.


const MyAssistantMessage = () => {
  const aiSDKMessages = useMessage((m) => getExternalStoreMessages(m));
  // ...
};
 
const WeatherToolUI = makeAssistantToolUI({
  render: () => {
    const aiSDKMessage = useContentPart((p) => getExternalStoreMessages(p)[0]);
    // ...
  },
});



To use an MD file as a prompt in the assistant-ui project, you can follow these steps:

Create your MD file with the desired prompt content.

Import the MD file into your React component:

tsx
Copy
import promptContent from './your-prompt-file.md';
Use the imported content with the useAssistantInstructions hook:
tsx
Copy
import { useAssistantInstructions } from "@assistant-ui/react";

function YourComponent() {
  useAssistantInstructions(promptContent);

  // Rest of your component code
}


To call a webhook on n8n that sends a user ID and message, and receives a JSON response, you can follow these steps:

Set up the webhook in n8n:

Create a new workflow in n8n
Add a "Webhook" node as the trigger
Configure the webhook to accept POST requests with the user ID and message as parameters
In your assistant-ui project, you can use the fetch API to send a POST request to the n8n webhook. Here's an example of how you can implement this:

typescript
Copy
async function callN8NWebhook(userId: string, message: string) {
  const webhookUrl = 'YOUR_N8N_WEBHOOK_URL';
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    throw error;
  }
}
You can then use this function in your component or API route:
typescript
Copy
import { useCallback } from 'react';

function YourComponent() {
  const handleWebhookCall = useCallback(async (userId: string, message: string) => {
    try {
      const result = await callN8NWebhook(userId, message);
      console.log('Webhook response:', result);
      // Handle the response as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle errors
    }
  }, []);

  // Rest of your component code
}
Remember to replace 'YOUR_N8N_WEBHOOK_URL' with the actual URL of your n8n webhook.

This implementation allows you to send a POST request to your n8n webhook with the user ID and message, and then handle the JSON response returned by n8n. Make sure to handle errors appropriately and consider implementing retry logic for network failures if needed.

 structure the ONE project using Astro, React, Assistant UI, and Vercel AI SDK, you can follow this approach:

Project Structure:
unknown
Copy
one/
├── src/
│   ├── components/
│   │   └── AIAgent.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── utils/
│       └── aiConfig.ts
├── public/
│   └── logo.svg
├── astro.config.mjs
├── package.json
└── tsconfig.json
AIAgent Component:
Create an AIAgent.astro component that will handle the AI chat functionality:

astro
Copy
---
import { Thread } from '@assistant-ui/react-ui';
import { useEdgeRuntime } from '@assistant-ui/react';
import { makeMarkdownText } from '@assistant-ui/react-markdown';

const MarkdownText = makeMarkdownText();

const { frontmatter, content } = Astro.props;
const aiConfig = frontmatter.ai;
---

<div class="ai-agent">
  <Thread
    client:load
    runtime={useEdgeRuntime({ api: '/api/chat' })}
    assistantMessage={{ components: { Text: MarkdownText } }}
    welcome={{
      message: aiConfig.welcome.message,
      avatar: aiConfig.welcome.avatar,
      suggestions: aiConfig.welcome.suggestions
    }}
  />
</div>

<script define:vars={{ aiConfig, content }}>
  // Set up Vercel AI SDK configuration
  import { useChat } from 'ai/react';

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    initialMessages: [
      { role: 'system', content: aiConfig.systemPrompt },
      { role: 'user', content: content }
    ],
    body: {
      model: aiConfig.model,
      temperature: aiConfig.temperature,
      max_tokens: aiConfig.maxTokens
    }
  });
</script>
Dynamic Page Route:
Create a [slug].astro file in the pages directory to handle dynamic routes:

astro
Copy
---
import Layout from '../layouts/Layout.astro';
import AIAgent from '../components/AIAgent.astro';

export async function getStaticPaths() {
  // Implement logic to get all markdown files
  // Return an array of objects with params: { slug: 'page-name' }
}

const { Content, frontmatter } = Astro.props;
---

<Layout title={frontmatter.title}>
  <Content />
  <AIAgent frontmatter={frontmatter} content={Content} />
</Layout>
API Route:
Create an API route to handle chat requests:

typescript
Copy
// src/pages/api/chat.ts
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
};

export default async function POST(req: Request) {
  const { messages, model, temperature, max_tokens } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens,
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
Configuration Utility:
Create a utility function to parse the frontmatter AI configuration:

typescript
Copy
// src/utils/aiConfig.ts
export function parseAIConfig(frontmatter: any) {
  return {
    provider: frontmatter.provider || 'openai',
    model: frontmatter.model || 'gpt-4o-mini',
    apiEndpoint: frontmatter.apiEndpoint || 'https://api.openai.com/v1',
    runtime: frontmatter.runtime || 'edge',
    temperature: frontmatter.temperature || 0.7,
    maxTokens: frontmatter.maxTokens || 2000,
    systemPrompt: frontmatter.systemPrompt || 'You are a helpful AI assistant.',
    welcome: frontmatter.welcome || {
      message: 'How can I assist you today?',
      avatar: '/logo.svg',
      suggestions: [],
    },
  };
}
This structure allows you to create Markdown files for each page with the AI configuration in the frontmatter. The AIAgent component will use this configuration to set up the chat interface and interact with the OpenAI API through the Vercel AI SDK.

Remember to install the necessary dependencies:

bash
Copy
npm install @assistant-ui/react @assistant-ui/react-ui @assistant-ui/react-markdown ai openai
This setup provides a foundation for building an AI agent system where each page has its own agent, configured through the frontmatter of the Markdown files.

To use Assistant UI in an Astro project, follow these detailed instructions:

Install Dependencies
First, install the necessary packages:

bash
Copy
npm install @assistant-ui/react @assistant-ui/react-ui @assistant-ui/react-markdown ai openai
Create an AIAgent Component
Create a new file AIAgent.astro in your src/components directory:

astro
Copy
---
import { Thread } from '@assistant-ui/react-ui';
import { useEdgeRuntime } from '@assistant-ui/react';
import { makeMarkdownText } from '@assistant-ui/react-markdown';

const MarkdownText = makeMarkdownText();

const { frontmatter, content } = Astro.props;
const aiConfig = frontmatter.ai;
---

<div class="ai-agent">
  <Thread
    client:load
    runtime={useEdgeRuntime({ api: '/api/chat' })}
    assistantMessage={{ components: { Text: MarkdownText } }}
    welcome={{
      message: aiConfig.welcome.message,
      avatar: aiConfig.welcome.avatar,
      suggestions: aiConfig.welcome.suggestions
    }}
  />
</div>

<script define:vars={{ aiConfig, content }}>
  import { useChat } from 'ai/react';

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    initialMessages: [
      { role: 'system', content: aiConfig.systemPrompt },
      { role: 'user', content: content }
    ],
    body: {
      model: aiConfig.model,
      temperature: aiConfig.temperature,
      max_tokens: aiConfig.maxTokens
    }
  });
</script>
Create a Dynamic Route
In your src/pages directory, create a [slug].astro file:

astro
Copy
---
import Layout from '../layouts/Layout.astro';
import AIAgent from '../components/AIAgent.astro';

export async function getStaticPaths() {
  // Implement logic to get all markdown files
  // Return an array of objects with params: { slug: 'page-name' }
}

const { Content, frontmatter } = Astro.props;
---

<Layout title={frontmatter.title}>
  <Content />
  <AIAgent frontmatter={frontmatter} content={Content} />
</Layout>
Set Up API Route
Create a new file chat.ts in your src/pages/api directory:

typescript
Copy
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
};

export default async function POST(req: Request) {
  const { messages, model, temperature, max_tokens } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens,
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
Create Configuration Utility
Create a new file aiConfig.ts in your src/utils directory:

typescript
Copy
export function parseAIConfig(frontmatter: any) {
  return {
    provider: frontmatter.provider || 'openai',
    model: frontmatter.model || 'gpt-4o-mini',
    apiEndpoint: frontmatter.apiEndpoint || 'https://api.openai.com/v1',
    runtime: frontmatter.runtime || 'edge',
    temperature: frontmatter.temperature || 0.7,
    maxTokens: frontmatter.maxTokens || 2000,
    systemPrompt: frontmatter.systemPrompt || 'You are a helpful AI assistant.',
    welcome: frontmatter.welcome || {
      message: 'How can I assist you today?',
      avatar: '/logo.svg',
      suggestions: [],
    },
  };
}
Create Markdown Files
Create your Markdown files with the AI configuration in the frontmatter:

markdown
Copy
---
title: My Page
ai:
  provider: openai
  model: gpt-4o-mini
  apiEndpoint: https://api.openai.com/v1
  runtime: edge
  temperature: 0.7
  maxTokens: 2000
  systemPrompt: You are a helpful AI assistant.
  welcome:
    message: How can I assist you today?
    avatar: /logo.svg
    suggestions:
      - label: Tell me about ONE
        prompt: What is ONE and how can it help me?
      - label: Get Started
        prompt: How do I get started with ONE?
---

Your page content goes here.
This setup allows you to use Assistant UI in your Astro project, with each page having its own AI agent configured through the frontmatter of the Markdown files.

