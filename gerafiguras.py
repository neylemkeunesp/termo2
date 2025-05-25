import cv2, pathlib, layoutparser as lp

# --- carrega modelo ---
model = lp.Detectron2LayoutModel(
    "lp://PubLayNet/mask_rcnn_X_101_32x8d_FPN_3x/config",
    extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.6],
    label_map={0: "Text", 1: "Title", 2: "List", 3: "Table", 4: "Figure"},
)

out_dir = pathlib.Path("figs")
out_dir.mkdir(exist_ok=True)

for page_png in sorted(pathlib.Path(".").glob("page-*.png")):
    img = cv2.cvtColor(cv2.imread(str(page_png)), cv2.COLOR_BGR2RGB)
    layout = model.detect(img)
    figures = [b for b in layout if b.type == "Figure"]

    for i, fig in enumerate(figures, 1):
        seg = fig.pad(5, 5, 5, 5).crop_image(img)   # ndarray RGB
        # ---- escolha 1: OpenCV ----
        cv2.imwrite(str(out_dir / f"{page_png.stem}_fig{i}.png"),
                    cv2.cvtColor(seg, cv2.COLOR_RGB2BGR))
        # ---- escolha 2: Pillow ----
        # from PIL import Image
        # Image.fromarray(seg).save(out_dir / f"{page_png.stem}_fig{i}.png")
