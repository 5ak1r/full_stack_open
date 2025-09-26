```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    browser->>server: note contents
    deactivate server

    Note right of browser: form data is sent with HTTP post

```