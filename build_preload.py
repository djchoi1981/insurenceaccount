import os
import base64
import json

folder = '/Users/djchoi81/Library/CloudStorage/GoogleDrive-djchoi19810402@gmail.com/내 드라이브/보험금 청구 에이전트/청구서양식'
out_file = '/Users/djchoi81/Library/CloudStorage/GoogleDrive-djchoi19810402@gmail.com/내 드라이브/보험금 청구 에이전트/templates_data.js'

templates = []
for f in os.listdir(folder):
    if f.lower().endswith('.pdf'):
        path = os.path.join(folder, f)
        with open(path, 'rb') as pdf:
            b64 = base64.b64encode(pdf.read()).decode('utf-8')
            name = os.path.splitext(f)[0]
            templates.append({'name': name, 'base64': 'data:application/pdf;base64,' + b64})

with open(out_file, 'w', encoding='utf-8') as out:
    out.write('const PRELOADED_TEMPLATES = ' + json.dumps(templates) + ';\n')
