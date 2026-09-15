import subprocess
import os
import re
import numpy as np
from PIL import Image

def clean_potrace_svg(svg_raw, fill_color):
    """Clean potrace SVG output: replace path fill, remove default comment/dtd, ensure clean attributes"""
    # Find path data
    path_matches = re.findall(r'<path d="([^"]+)"', svg_raw)
    if not path_matches:
        # maybe multiple lines in path
        m = re.search(r'<path d="([\s\S]+?)"', svg_raw)
        path_data = m.group(1) if m else ""
    else:
        path_data = " ".join(path_matches)

    # Find width, height, viewBox, and g transform
    viewbox_match = re.search(r'viewBox="([^"]+)"', svg_raw)
    viewbox = viewbox_match.group(1) if viewbox_match else "0 0 1000 1000"
    
    transform_match = re.search(r'<g transform="([^"]+)"', svg_raw)
    transform = transform_match.group(1) if transform_match else ""

    svg_out = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" fill="none">
  <g transform="{transform}" fill="{fill_color}" stroke="none">
    <path d="{path_data}" fill-rule="evenodd" />
  </g>
</svg>'''
    return svg_out

def main():
    os.makedirs('public/brand', exist_ok=True)
    os.makedirs('summaries/screenshots/01', exist_ok=True)
    os.makedirs('scripts', exist_ok=True)

    master_path = 'brand-source/alaryam-logo-hires.png'
    im = Image.open(master_path)
    arr = np.array(im)
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]

    # Blue pixels: alpha > 128, blue dominant (drops grey speck at r=222, g=222, b=222)
    blue_mask = (a > 128) & (b > 100) & (r < 100) & (g < 100)

    # 1. Full Logo
    y_indices, x_indices = np.where(blue_mask)
    ymin, ymax = y_indices.min(), y_indices.max()
    xmin, xmax = x_indices.min(), x_indices.max()
    w = xmax - xmin + 1
    h = ymax - ymin + 1

    padx = int(w * 0.02)
    pady = int(h * 0.02)

    crop_ymin = max(0, ymin - pady)
    crop_ymax = min(arr.shape[0] - 1, ymax + pady)
    crop_xmin = max(0, xmin - padx)
    crop_xmax = min(arr.shape[1] - 1, xmax + padx)

    cropped_full = blue_mask[crop_ymin:crop_ymax+1, crop_xmin:crop_xmax+1]

    # Invert for potrace (in PBM, 1 is black/foreground, in PIL mode 1 False is 1)
    pbm_full_path = 'scripts/logo_full.pbm'
    Image.fromarray(~cropped_full).save(pbm_full_path)

    svg_full_raw = 'scripts/logo_full_raw.svg'
    cmd = [
        '/opt/local/bin/potrace',
        '-s',
        '--turdsize', '20',
        '--alphamax', '1.0',
        '--opttolerance', '0.2',
        '-o', svg_full_raw,
        pbm_full_path
    ]
    subprocess.run(cmd, check=True)

    with open(svg_full_raw, 'r') as f:
        full_raw_text = f.read()

    full_blue = clean_potrace_svg(full_raw_text, '#0D07AD')
    full_white = clean_potrace_svg(full_raw_text, '#FFFFFF')

    with open('public/brand/logo-full-blue.svg', 'w') as f:
        f.write(full_blue)
    with open('public/brand/logo-full-white.svg', 'w') as f:
        f.write(full_white)

    # 2. Mark (Triangle "A" only + top rule, ending at row 2018)
    mark_mask = blue_mask.copy()
    mark_mask[2019:, :] = False

    ym_indices, xm_indices = np.where(mark_mask)
    ymin_m, ymax_m = ym_indices.min(), ym_indices.max()
    xmin_m, xmax_m = xm_indices.min(), xm_indices.max()
    wm = xmax_m - xmin_m + 1
    hm = ymax_m - ymin_m + 1

    padx_m = int(wm * 0.02)
    pady_m = int(hm * 0.02)

    crop_ymin_m = max(0, ymin_m - pady_m)
    crop_ymax_m = min(arr.shape[0] - 1, ymax_m + pady_m)
    crop_xmin_m = max(0, xmin_m - padx_m)
    crop_xmax_m = min(arr.shape[1] - 1, xmax_m + padx_m)

    cropped_mark = mark_mask[crop_ymin_m:crop_ymax_m+1, crop_xmin_m:crop_xmax_m+1]

    pbm_mark_path = 'scripts/logo_mark.pbm'
    Image.fromarray(~cropped_mark).save(pbm_mark_path)

    svg_mark_raw = 'scripts/logo_mark_raw.svg'
    cmd_mark = [
        '/opt/local/bin/potrace',
        '-s',
        '--turdsize', '20',
        '--alphamax', '1.0',
        '--opttolerance', '0.2',
        '-o', svg_mark_raw,
        pbm_mark_path
    ]
    subprocess.run(cmd_mark, check=True)

    with open(svg_mark_raw, 'r') as f:
        mark_raw_text = f.read()

    mark_blue = clean_potrace_svg(mark_raw_text, '#0D07AD')
    mark_white = clean_potrace_svg(mark_raw_text, '#FFFFFF')

    with open('public/brand/mark-blue.svg', 'w') as f:
        f.write(mark_blue)
    with open('public/brand/mark-white.svg', 'w') as f:
        f.write(mark_white)

    # 3. Favicon.svg: mark-blue centered on a white square with 10% padding
    # Mark dimensions from mark SVG viewBox
    vm = re.search(r'viewBox="0 0 ([0-9.]+) ([0-9.]+)"', mark_blue)
    mw, mh = float(vm.group(1)), float(vm.group(2))
    # Make square with 10% padding
    sq_size = max(mw, mh) / 0.8
    offset_x = (sq_size - mw) / 2.0
    offset_y = (sq_size - mh) / 2.0

    # Extract path and transform from mark_blue
    m_path = re.search(r'<path d="([^"]+)"', mark_blue).group(1)
    m_transform = re.search(r'<g transform="([^"]+)"', mark_blue).group(1)

    favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {sq_size:.2f} {sq_size:.2f}">
  <rect width="100%" height="100%" fill="#FFFFFF" />
  <g transform="translate({offset_x:.2f}, {offset_y:.2f})">
    <g transform="{m_transform}" fill="#0D07AD" stroke="none">
      <path d="{m_path}" fill-rule="evenodd" />
    </g>
  </g>
</svg>'''

    with open('public/favicon.svg', 'w') as f:
        f.write(favicon_svg)

    print("SVG assets generated successfully.")

if __name__ == '__main__':
    main()
