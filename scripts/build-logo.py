"""
HDF Bâti — correction du logo master (SVG vectorisé).

Pourquoi ce script existe
-------------------------
Le master livré (HDF_Bati_Logo_Master_FINAL.zip) compose le mot en DEUX textes
séparés : « HDF BÂT » puis « I » positionné à x=686. Selon la police disponible,
cela produit l'espace interdit « HDF BÂT I » (visible sur les PNG livrés eux-mêmes).

Cette correction ne redessine rien :
- pictogramme maison : tracés du master, à l'identique ;
- grande feuille : ellipse du master, à l'identique ;
- police : DejaVu Sans Bold (celle déclarée dans le SVG master), mêmes corps,
  approche (-2) et couleurs ;
- seule différence : « HDF BÂTI » est composé en UN seul mot (shaping HarfBuzz,
  crénage de la police), puis la petite feuille est ancrée sur le fût du I avec le
  même décalage relatif que dans le master ;
- le texte est converti en contours : le rendu ne dépend plus d'aucune police
  installée, ÉNERGÉTIQUE ne peut plus être tronqué.

Usage : python3 scripts/build-logo.py  (écrit dans public/brand/)
Dépendances : pip install fonttools uharfbuzz
"""
import os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONT = os.environ.get("HDF_LOGO_FONT", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "brand")

GREEN, ENERGY, DEEP, NAVY = "#0B7A3B", "#79C51D", "#083D2E", "#073B63"

ft = TTFont(FONT)
gs = ft.getGlyphSet()
UPEM = ft["head"].unitsPerEm
blob = hb.Blob.from_file_path(FONT)
hbfont = hb.Font(hb.Face(blob))


def shape(text, size, x, y, tracking=0.0):
    """Retourne (path_d, glyph_boxes) pour un texte posé sur la ligne de base y."""
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": False})
    s = size / UPEM
    pen = SVGPathPen(gs)
    cx = x
    boxes = []
    names = ft.getGlyphOrder()
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = names[info.codepoint]
        tp = TransformPen(pen, (s, 0, 0, -s, cx + pos.x_offset * s, y - pos.y_offset * s))
        gs[name].draw(tp)
        bp = BoundsPen(gs)
        gs[name].draw(bp)
        if bp.bounds:
            xmin, ymin, xmax, ymax = bp.bounds
            boxes.append((name, cx + xmin * s, y - ymax * s, cx + xmax * s, y - ymin * s))
        else:
            boxes.append((name, cx, y, cx, y))
        cx += pos.x_advance * s + tracking
    return pen.getCommands(), boxes, cx - tracking


# ---- Mesures du master --------------------------------------------------------
# Master : « I » posé à x=686, petite feuille cx=704 → décalage relatif au fût du I.
_, i_master, _ = shape("I", 90, 686, 153)
master_i_center = (i_master[0][1] + i_master[0][3]) / 2
LEAF_DX = 704 - master_i_center          # conservé tel quel
LEAF_CY = 61

# ---- Composition corrigée -----------------------------------------------------
word_d, word_boxes, word_end = shape("HDF BÂTI", 90, 225, 153, tracking=-2)
i_box = word_boxes[-1]
assert i_box[0] == "I", i_box
i_center = (i_box[1] + i_box[3]) / 2
leaf_cx = i_center + LEAF_DX
word_left = word_boxes[0][1]
word_right = max(b[3] for b in word_boxes)

TAG = "VOTRE EXPERT EN RÉNOVATION ÉNERGÉTIQUE"
tag_probe_d, tag_probe, tag_end = shape(TAG, 17.5, 0, 208, tracking=0.15)
tag_w = tag_end
# Centré sous le mot (comme dans le master), sans jamais dépasser à gauche du mot.
tag_x = max(word_left, (word_left + word_right) / 2 - tag_w / 2)
tag_d, tag_boxes, tag_right = shape(TAG, 17.5, tag_x, 208, tracking=0.15)
tag_right = max(b[3] for b in tag_boxes)

PICTO = """<g fill="none" stroke="{house}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 105 L105 30 L185 110"/>
    <path d="M30 105 V220 H160 V150"/>
    <path d="M55 150 L105 100 L160 155"/>
  </g>
  <ellipse cx="180" cy="52" rx="22" ry="38" transform="rotate(35 180 52)" fill="{leaf}"/>"""

PAD = 12


def svg(variant, with_tag=True):
    colors = {
        "principal": dict(house=GREEN, leaf=ENERGY, word=DEEP, tag=NAVY),
        "inverse": dict(house="#FFFFFF", leaf=ENERGY, word="#FFFFFF", tag="#FFFFFF"),
        "blanc": dict(house="#FFFFFF", leaf="#FFFFFF", word="#FFFFFF", tag="#FFFFFF"),
    }[variant]
    right = max(word_right, leaf_cx + 22, tag_right if with_tag else 0) + PAD
    top = 30 - 7 - PAD - 8  # haut du toit (trait 14px) / grande feuille
    top = min(top, 52 - 42 - PAD)
    bottom = (220 + 7 + PAD)
    width = right - (30 - 7 - PAD)
    x0 = 30 - 7 - PAD
    title = "HDF BÂTI — Votre expert en rénovation énergétique" if with_tag else "HDF BÂTI"
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {top:.1f} {width:.1f} {bottom - top:.1f}" role="img" aria-label="{title}">',
        f"  <title>{title}</title>",
        "  " + PICTO.format(**colors),
        f'  <path fill="{colors["word"]}" d="{word_d}"/>',
        f'  <ellipse cx="{leaf_cx:.2f}" cy="{LEAF_CY}" rx="10.5" ry="20" transform="rotate(35 {leaf_cx:.2f} {LEAF_CY})" fill="{colors["leaf"]}"/>',
    ]
    if with_tag:
        parts.append(f'  <path fill="{colors["tag"]}" d="{tag_d}"/>')
    parts.append("</svg>\n")
    return "\n".join(parts), (width, bottom - top)


def picto(variant):
    colors = {"principal": dict(house=GREEN, leaf=ENERGY), "blanc": dict(house="#FFFFFF", leaf=ENERGY)}[variant]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 220 240" role="img" aria-label="HDF BÂTI">\n'
            f"  <title>HDF BÂTI</title>\n  " + PICTO.format(**colors) + "\n</svg>\n")


os.makedirs(OUT, exist_ok=True)
for name, variant, tag in [
    ("hdf-bati-logo.svg", "principal", True),
    ("hdf-bati-logo-inverse.svg", "inverse", True),
    ("hdf-bati-logo-blanc.svg", "blanc", True),
    ("hdf-bati-logo-compact.svg", "principal", False),
    ("hdf-bati-logo-compact-inverse.svg", "inverse", False),
]:
    content, (w, h) = svg(variant, tag)
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(content)
    print(f"{name}: ratio {w / h:.4f} ({w:.1f}x{h:.1f})")
open(os.path.join(OUT, "hdf-bati-pictogramme.svg"), "w").write(picto("principal"))
open(os.path.join(OUT, "hdf-bati-pictogramme-blanc.svg"), "w").write(picto("blanc"))

gap_T_I = word_boxes[-1][1] - word_boxes[-2][3]
print(f"Écart visuel T→I : {gap_T_I:.1f}px (master livré : {686 + (i_master[0][1]-686) - word_boxes[-2][3]:.1f}px)")
print(f"Feuille : cx={leaf_cx:.1f} (centre du fût du I={i_center:.1f}, décalage master conservé {LEAF_DX:+.1f})")
print(f"Signature : x {tag_x:.1f} → {tag_right:.1f} ; mot : {word_left:.1f} → {word_right:.1f}")
