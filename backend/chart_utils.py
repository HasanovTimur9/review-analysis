import base64
import io
from typing import Optional
import os


def image_to_base64(image_path: str) -> Optional[str]:
    if not os.path.exists(image_path):
        return None
    
    try:
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            ext = os.path.splitext(image_path)[1].lower()
            mime_type = 'image/png' if ext == '.png' else 'image/jpeg' if ext == '.jpg' else 'image/png'
            return f"data:{mime_type};base64,{encoded_string}"
    except Exception as e:
        print(f"Ошибка при конвертации изображения {image_path}: {e}")
        return None


def base64_to_image(base64_string: str, output_path: str) -> bool:
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        
        os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
        
        with open(output_path, 'wb') as image_file:
            image_file.write(image_data)
        return True
    except Exception as e:
        print(f"Ошибка при сохранении изображения: {e}")
        return False


def matplotlib_fig_to_base64(fig) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=300, bbox_inches='tight')
    buf.seek(0)
    encoded_string = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    return f"data:image/png;base64,{encoded_string}"


def get_base64_from_file_or_fig(file_path: Optional[str] = None, fig=None) -> Optional[str]:
    if file_path and os.path.exists(file_path):
        return image_to_base64(file_path)
    elif fig is not None:
        return matplotlib_fig_to_base64(fig)
    return None

