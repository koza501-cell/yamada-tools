from PIL import Image, ImageDraw, ImageFont

def create_image(width=1200, height=630):
    img = Image.new('RGB', (width, height), color='#f5f5f5')
    draw = ImageDraw.Draw(img)
    
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    return img, draw, font_large, font_medium, font_small

# 1. PASSWORD GENERATOR
img, draw, fl, fm, fs = create_image()
draw.rectangle([(50, 150), (500, 480)], fill='#ffebee', outline='#ff4444', width=5)
draw.text((275, 200), "危険", font=fl, fill='#ff4444', anchor='mm')
draw.text((275, 300), "password", font=fm, fill='#333', anchor='mm')
draw.text((275, 360), "123456", font=fm, fill='#333', anchor='mm')
draw.text((275, 420), "誕生日", font=fm, fill='#333', anchor='mm')

draw.rectangle([(700, 150), (1150, 480)], fill='#e8f5e9', outline='#4caf50', width=5)
draw.text((925, 200), "安全", font=fl, fill='#4caf50', anchor='mm')
draw.text((925, 320), "d8F#k9L$p2@x", font=fm, fill='#333', anchor='mm')
draw.text((925, 400), "強力", font=fs, fill='#666', anchor='mm')

draw.text((600, 315), "→", font=fl, fill='#666', anchor='mm')
img.save('public/blog-images/password-generator.jpg', quality=95)
print("✅ Created password-generator.jpg")

# 2. PDF COMPRESSION
img, draw, fl, fm, fs = create_image()
draw.rectangle([(50, 150), (500, 480)], fill='#fff3e0', outline='#ff9800', width=5)
draw.text((275, 250), "PDF", font=fl, fill='#333', anchor='mm')
draw.text((275, 350), "10 MB", font=fl, fill='#ff4444', anchor='mm')
draw.text((275, 430), "重い", font=fm, fill='#666', anchor='mm')

draw.rectangle([(700, 150), (1150, 480)], fill='#e8f5e9', outline='#4caf50', width=5)
draw.text((925, 250), "PDF", font=fl, fill='#333', anchor='mm')
draw.text((925, 350), "1 MB", font=fl, fill='#4caf50', anchor='mm')
draw.text((925, 430), "軽い", font=fm, fill='#666', anchor='mm')

draw.text((600, 315), "圧縮", font=fl, fill='#2196f3', anchor='mm')
img.save('public/blog-images/pdf-compression.jpg', quality=95)
print("✅ Created pdf-compression.jpg")

# 3. IMAGE RESIZE
img, draw, fl, fm, fs = create_image()
draw.rectangle([(100, 150), (400, 480)], fill='#ffebee', outline='#ff4444', width=5)
draw.text((250, 280), "エラー", font=fm, fill='#ff4444', anchor='mm')
draw.text((250, 350), "サイズ大", font=fs, fill='#666', anchor='mm')

draw.rectangle([(450, 200), (750, 430)], fill='#e3f2fd', outline='#2196f3', width=5)
draw.text((600, 315), "リサイズ", font=fm, fill='#2196f3', anchor='mm')

draw.rectangle([(800, 150), (1100, 480)], fill='#e8f5e9', outline='#4caf50', width=5)
draw.text((950, 280), "完了", font=fm, fill='#4caf50', anchor='mm')
draw.text((950, 350), "OK", font=fs, fill='#666', anchor='mm')

img.save('public/blog-images/image-resize.jpg', quality=95)
print("✅ Created image-resize.jpg")

# 4. INVOICE EXCEL
img, draw, fl, fm, fs = create_image()
draw.rectangle([(50, 100), (500, 530)], fill='#ffebee', outline='#ff4444', width=5)
draw.text((275, 180), "Excel", font=fl, fill='#333', anchor='mm')
draw.text((275, 280), "エラー", font=fm, fill='#ff4444', anchor='mm')
draw.text((275, 350), "面倒", font=fm, fill='#ff4444', anchor='mm')

draw.rectangle([(700, 100), (1150, 530)], fill='#e8f5e9', outline='#4caf50', width=5)
draw.text((925, 180), "ツール", font=fl, fill='#333', anchor='mm')
draw.text((925, 280), "自動計算", font=fm, fill='#4caf50', anchor='mm')
draw.text((925, 350), "簡単", font=fm, fill='#4caf50', anchor='mm')

draw.text((600, 315), "VS", font=fl, fill='#666', anchor='mm')
img.save('public/blog-images/invoice-excel.jpg', quality=95)
print("✅ Created invoice-excel.jpg")

# 5. SECURITY SERVERS
img, draw, fl, fm, fs = create_image()
draw.rectangle([(50, 100), (550, 530)], fill='#ffebee', outline='#ff4444', width=5)
draw.text((300, 180), "海外", font=fl, fill='#ff4444', anchor='mm')
draw.text((300, 280), "不明", font=fm, fill='#666', anchor='mm')
draw.text((300, 350), "危険", font=fm, fill='#666', anchor='mm')

draw.rectangle([(650, 100), (1150, 530)], fill='#e8f5e9', outline='#4caf50', width=5)
draw.text((900, 180), "国内", font=fl, fill='#4caf50', anchor='mm')
draw.text((900, 280), "60分削除", font=fm, fill='#666', anchor='mm')
draw.text((900, 350), "安全", font=fm, fill='#666', anchor='mm')

img.save('public/blog-images/security-servers.png', quality=95)
print("✅ Created security-servers.png")

print("\n🎉 All 5 blog images created successfully!")
