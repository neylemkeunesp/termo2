import os
import sys

try:
    import fitz
except ImportError:
    try:
        from PyMuPDF import fitz
    except ImportError:
        print("Error: PyMuPDF is not installed.")
        print("Please install it using one of the following commands:")
        print("pip install PyMuPDF")
        print("pip install fitz")
        sys.exit(1)

def convert_pdf_to_images(pdf_path):
    # Get the base name of the PDF file (without extension)
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Create output directory
    output_dir = f"{base_name}_images"
    os.makedirs(output_dir, exist_ok=True)

    try:
        # Open the PDF
        pdf = fitz.open(pdf_path)

        # Convert each page to an image
        for i, page in enumerate(pdf):
            # Render page to an image with higher resolution
            pix = page.get_pixmap(matrix=fitz.Matrix(3, 3))  # 3x zoom for better quality
            # Save the image
            pix.save(f"{output_dir}/slide{i+1:03d}.png")

        pdf.close()
        print(f"Images saved in directory: {output_dir}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python convert_pdf.py <pdf_file>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    if not pdf_path.lower().endswith('.pdf'):
        print("Error: Input file must be a PDF")
        sys.exit(1)
    
    convert_pdf_to_images(pdf_path)
