# Modular CSS Architecture

The CSS for this project is organized into modular source files and built artifacts.

## Structure

- **variables.css**: CSS Variables (Custom Properties) for colors, spacing, etc.
- **base.css**: Reset, typography base, global tag styles.
- **layout.css**: Grid system, header, footer, container logic.
- **components.css**: Reusable UI components (Buttons, Panels, Cards, Mega Menu).
- **sections.css**: Page-specific section styles (Hero, Contact, About).
- **utilities.css**: Helper classes and animations.
- **assets/css/labs/lab1.css**: Lab 1 source styles.
- **assets/css/labs/lab3.css**: Lab 3 source styles.
- **assets/css/labs/lab5.css**: Lab 5 source styles.

## How to make changes

1.  **NEVER** edit generated files directly:
    - `assets/css/main.css`
    - `assets/css/labs.css`
2.  Edit source files in:
    - `assets/css/modules/` for global styles
    - `assets/css/labs/` for lab-specific styles
3.  Run the build script to regenerate all CSS outputs.

## Build Script

Run the python script to rebuild CSS:

```bash
python3 Tools/build_css.py
```

This build regenerates:
- `assets/css/main.css` from `assets/css/modules/*.css`
- `assets/css/labs.css` from `assets/css/labs/*.css`

Validation:
- Run `python Tools/seo/check_lab_css_scoping.py` to ensure lab selectors stay scoped with `body.lab-*`.

Runtime loading:
- `main.css` is loaded globally from `Components/header.php`.
- `labs.css` is loaded automatically on `/Labs/` routes from `Components/header.php`.

And keeps legacy lab paths in sync for backward compatibility:
- `Labs/Lab1/css/knobs.css`
- `Labs/Lab3/moon.css`
- `Labs/Lab5_SitemapExtractor/css/style.css`
