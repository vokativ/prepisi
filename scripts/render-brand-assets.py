"""Render packaged Prepiši raster marks from the user's Balkan Sans archive."""

from __future__ import annotations

import argparse
import tempfile
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


GREEN = "#10231e"
CREAM = "#f8f0dd"
GOLD = "#e8ad38"
MASTER_SIZE = 512


def find_font_archive(project_root: Path) -> Path:
    archives = sorted(project_root.glob("*BalkanSans*.zip"))
    if not archives:
        raise FileNotFoundError("No BalkanSans ZIP archive found in the project root")
    return archives[0]


def extract_font(archive_path: Path, output_path: Path) -> None:
    with zipfile.ZipFile(archive_path) as archive:
        matches = [name for name in archive.namelist() if name.endswith("/BalkanSansOne-A.otf")]
        if len(matches) != 1:
            raise RuntimeError("Expected one BalkanSansOne-A.otf in the archive")
        output_path.write_bytes(archive.read(matches[0]))


def fitted_font(font_path: Path, text: str, max_width: int, max_height: int) -> ImageFont.FreeTypeFont:
    probe = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    for size in range(360, 40, -2):
        font = ImageFont.truetype(str(font_path), size)
        left, top, right, bottom = probe.textbbox((0, 0), text, font=font)
        if right - left <= max_width and bottom - top <= max_height:
            return font
    raise RuntimeError(f"Could not fit {text!r}")


def draw_centered(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, center_y: int) -> None:
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    width = right - left
    height = bottom - top
    draw.text(((MASTER_SIZE - width) / 2 - left, center_y - height / 2 - top), text, font=font, fill=CREAM)


def render_icon(font_path: Path, destination: Path) -> None:
    image = Image.new("RGBA", (MASTER_SIZE, MASTER_SIZE), (0, 0, 0, 0))
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((8, 8, 504, 504), radius=74, fill=255)
    field = Image.new("RGBA", image.size, GREEN)
    field_draw = ImageDraw.Draw(field)
    field_draw.rectangle((0, 448, MASTER_SIZE, MASTER_SIZE), fill=GOLD)
    image.paste(field, (0, 0), mask)

    draw = ImageDraw.Draw(image)
    # Balkan Sans One pairs every Cyrillic line with its Latin transliteration,
    # so one native ПРЕ string produces the compact PRE / ПРЕ two-line mark.
    # E is shared visually and avoids relying on a missing Š glyph.
    font = fitted_font(font_path, "ПРЕ", max_width=420, max_height=330)
    draw_centered(draw, "ПРЕ", font, center_y=231)
    image.save(destination)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    project_root = args.project_root.resolve()
    icon_directory = project_root / "assets" / "icons"
    icon_directory.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="prepisi-brand-") as temporary:
        font_path = Path(temporary) / "BalkanSansOne-A.otf"
        extract_font(find_font_archive(project_root), font_path)
        master_path = Path(temporary) / "icon-master.png"
        render_icon(font_path, master_path)
        master = Image.open(master_path)
        for size in (16, 32, 48, 128):
            master.resize((size, size), Image.Resampling.LANCZOS).save(icon_directory / f"icon-{size}.png")


if __name__ == "__main__":
    main()
