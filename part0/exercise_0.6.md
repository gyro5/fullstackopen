The diagram for exercise 0.6:

```mermaid
sequenceDiagram

participant browser
participant server

browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
activate server
server-->>browser: 201 Created - The HTML page
Note left of server: The HTML page stays but the new note is added.
deactivate server
```
