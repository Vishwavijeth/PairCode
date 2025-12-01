from app.schemas.room import AutocompleteRequest, AutocompleteResponse


def get_autocomplete_suggestion(request: AutocompleteRequest) -> AutocompleteResponse:
    code = request.code
    cursor_pos = request.cursorPosition
    language = request.language.lower()

    # Extract the part before the cursor
    before_cursor = code[:cursor_pos]

    # Extract current line
    current_line = before_cursor.split("\n")[-1]

    # Extract the current token (word being typed)
    i = len(current_line) - 1
    while i >= 0 and (current_line[i].isalpha() or current_line[i] in "_"):
        i -= 1

    current_token = current_line[i + 1:]  # word after non-alpha chars
    token_start_pos = cursor_pos - len(current_token)

    # Language keyword maps
    suggestions_map = {
        "python": [
            ("def", "def function_name():"),
            ("for", "for item in iterable:"),
            ("if", "if condition:"),
            ("class", "class ClassName:"),
            ("import", "import module"),
            ("from", "from module import "),
        ],
        "javascript": [
            ("fun", "function "),
            ("func", "function "),
            ("const", "const "),
            ("let", "let "),
            ("if", "if (condition) {}"),
            ("for", "for (let i = 0; i < length; i++) {}"),
        ],
        "java": [
            ("pub", "public "),
            ("pri", "private "),
            ("class", "class "),
            ("if", "if (condition) {}"),
            ("for", "for (int i = 0; i < length; i++) {}"),
        ]
    }

    # Select language or fall back to python
    language_suggestions = suggestions_map.get(language, suggestions_map["python"])

    best = None

    # Match the current token with keyword prefixes
    for key, suggestion in language_suggestions:
        if current_token.startswith(key):
            best = suggestion
            break

    # If nothing matches → generic suggestion
    if not best:
        default_map = {
            "python": "# add code...",
            "javascript": "// add code...",
            "java": "// add code..."
        }
        best = default_map.get(language, "// add code...")

    return AutocompleteResponse(
        suggestion=best,
        startPosition=token_start_pos,
        endPosition=cursor_pos
    )
