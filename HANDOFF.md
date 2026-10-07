## Status

Frontend UI foundation complete and visually locked.

Completed:
- Home / Conversation / History
- shared view shell and spacing tokens
- normalized header/action/composer sizing
- compact responsive layout
- launcher/open/close behavior
- history navigation
- assistant typing indicator
- `isAssistantLoading` UI plumbing
- accessibility basics

Current loading flow is UI-only.
No fake delay or fake assistant response.

## Next

- integrate actual FastAPI/RAG endpoint when contract is ready
- connect loading state to real request lifecycle
- render real assistant responses and errors
- final architecture cleanup only if still needed

## Not implemented yet

- backend/RAG integration
- streaming
- persistent history
- auth
- routing
- fullscreen/maximize
- dashboard injection