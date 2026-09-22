---
id: python
title: Python
tags: [language, python]
globs: ["**/*.py"]
description: Idiomatic, modern Python.
---

- Target modern Python (3.10+). Use type hints on all function signatures and public attributes.
- Follow PEP 8. Use a formatter (`black` or `ruff format`) and a linter (`ruff`); do not hand-format.
- Prefer f-strings for interpolation. Never use `%` or `.format()` for new code.
- Use `pathlib.Path` for filesystem paths, not `os.path` string manipulation.
- Manage dependencies and virtual environments explicitly (`uv`, `poetry`, or `venv` + `pip`). Pin versions.
- Use dataclasses or Pydantic models for structured data instead of bare dicts or tuples.
- Prefer context managers (`with`) for files, locks, and connections. Never leak resources.
- Raise specific exceptions; never `except:` bare or `except Exception: pass`.
- Keep side effects out of module top level. Guard scripts with `if __name__ == "__main__":`.
- Prefer comprehensions and generators over manual loops when they stay readable.
