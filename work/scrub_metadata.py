from __future__ import annotations

import sys
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from pypdf import PdfReader, PdfWriter


def scrub_pptx(path: Path) -> None:
    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False, dir=path.parent) as tmp:
        temp_path = Path(tmp.name)
    with zipfile.ZipFile(path, "r") as src, zipfile.ZipFile(temp_path, "w", zipfile.ZIP_DEFLATED) as dst:
        for info in src.infolist():
            data = src.read(info.filename)
            if info.filename == "docProps/core.xml":
                root = ET.fromstring(data)
                for child in list(root):
                    tag = child.tag.rsplit("}", 1)[-1]
                    if tag in {"creator", "lastModifiedBy", "title", "subject", "description", "keywords", "category", "contentStatus"}:
                        child.text = ""
                data = ET.tostring(root, encoding="utf-8", xml_declaration=True)
            elif info.filename == "docProps/app.xml":
                root = ET.fromstring(data)
                for child in list(root):
                    tag = child.tag.rsplit("}", 1)[-1]
                    if tag in {"Company", "Manager"}:
                        child.text = ""
                data = ET.tostring(root, encoding="utf-8", xml_declaration=True)
            dst.writestr(info, data)
    temp_path.replace(path)


def scrub_pdf(path: Path) -> None:
    reader = PdfReader(path)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.metadata = {}
    temp_path = path.with_suffix(".clean.pdf")
    with temp_path.open("wb") as f:
        writer.write(f)
    temp_path.replace(path)


for arg in sys.argv[1:]:
    p = Path(arg)
    if p.suffix.lower() == ".pptx":
        scrub_pptx(p)
    elif p.suffix.lower() == ".pdf":
        scrub_pdf(p)
    else:
        raise SystemExit(f"Unsupported file: {p}")

