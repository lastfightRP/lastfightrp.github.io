import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def add_dashes(match):
    block = match.group(0)
    
    def p_replace(p_match):
        p_content = p_match.group(1)
        # Split by <br> or <br/>
        lines = re.split(r'(<br\s*/?>)', p_content)
        new_lines = []
        for part in lines:
            if part.lower().startswith('<br'):
                new_lines.append(part)
            else:
                s = part.strip()
                if s:
                    # check if already has dash to avoid "- - text"
                    if not s.startswith('-'):
                        new_lines.append('- ' + s)
                    else:
                        new_lines.append(s)
                else:
                    new_lines.append(s)
        return '<p>' + ''.join(new_lines) + '</p>'
    
    new_block = re.sub(r'<p>(.*?)</p>', p_replace, block, flags=re.DOTALL)
    return new_block

new_content = re.sub(r'<div class="rule-detail">.*?</div>', add_dashes, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Done formatting index.html")
