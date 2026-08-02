# Explainable Multi-Class Brain Tumor Classification from MRI

A model that only outputs a class label is incomplete for medical imaging. The more useful question is which regions of the scan drove the decision.

This project implements a full classification pipeline and then attaches two complementary explainability methods so that every prediction can be inspected visually.


## Problem Statement

Deep learning models for MRI tumor classification frequently report high accuracy yet provide no insight into their reasoning. In a domain where false confidence is dangerous, a black-box score is insufficient.

Existing public demos often stop at the prediction. Grad-CAM or SHAP, when present, are usually offline notebook visualizations rather than part of a usable inference system. The engineering gap is the integration of classification, explanation, and a practical interface into one coherent application.


## Project Overview

The system classifies brain MRI images into four categories:

- Glioma
- Meningioma
- Pituitary Tumor
- No Tumor

For every prediction it also produces:

- Class probabilities and confidence
- A Grad-CAM heatmap overlaid on the original scan
- SHAP-based pixel attribution
- A downloadable PDF report

A FastAPI backend serves the model and explanation pipeline. A lightweight web frontend allows image upload and interactive inspection of results.


## System Architecture

```
MRI Image Upload
      │
      ▼
Preprocessing (resize, normalize)
      │
      ▼
EfficientNet-B0 (fine-tuned)
      │
      ├──→ Softmax probabilities + predicted class
      │
      ├──→ Grad-CAM (target layer activations + gradients)
      │         │
      │         ▼
      │    Heatmap overlay
      │
      └──→ SHAP (optional pixel attribution)
      │
      ▼
FastAPI response (JSON + images)
      │
      ▼
Web frontend + PDF report generation
```

The same forward pass used for classification also supplies the activations required by Grad-CAM, keeping the explanation path efficient.


## Technology Stack and Design Decisions

**EfficientNet-B0** was selected after comparing several ImageNet-pretrained backbones. It offered the best accuracy–latency trade-off on the available hardware while still producing clean feature maps for Grad-CAM.

**PyTorch + TorchVision** provided the training and inference stack. The decision to stay inside the PyTorch ecosystem simplified the integration of Grad-CAM (which needs access to intermediate activations and gradients) and later SHAP.

**Grad-CAM** was chosen as the primary explanation method because it is computationally cheap at inference time and produces spatially coherent heatmaps that are easy to interpret overlaid on MRI slices.

**SHAP** was added as a secondary, more expensive attribution method. It is not run on every request by default; the architecture allows it to be requested when deeper analysis is needed.

**FastAPI** was used for the inference service because it handles file uploads cleanly, validates inputs with Pydantic, and returns both JSON metadata and image blobs without additional framework overhead.

The frontend remains deliberately simple (HTML, CSS, JavaScript). The engineering effort was concentrated on the model and explanation pipeline rather than on a complex UI.


## Implementation Details

### Training
Transfer learning proceeded in two stages: initial training with the backbone frozen, followed by fine-tuning of later blocks. Standard augmentations, early stopping, and checkpointing on validation performance were used. The dataset is the publicly available Brain Tumor MRI Dataset from Kaggle, split into the four target classes.

### Grad-CAM Integration
A target convolutional layer near the end of the EfficientNet backbone is registered for activation and gradient capture. After the backward pass for the predicted class, the weighted activation maps are upsampled and overlaid on the original image. The resulting visualization is returned alongside the classification result.

### Inference API
The `/predict` endpoint accepts an image file, runs the full pipeline, and returns:

- Predicted class
- Confidence and full probability vector
- Grad-CAM overlay image
- Optional SHAP attribution when requested

### Report Generation
A PDF summarizing the prediction, confidence, and key visualizations can be generated on demand for documentation or review purposes.


## Challenges and Trade-offs

Grad-CAM heatmaps occasionally highlighted non-tumor regions (bright artifacts, skull edges, or intensity inhomogeneities). This forced additional scrutiny of preprocessing and of the exact layer chosen for gradient extraction. A visually plausible heatmap is not automatically a correct explanation.

SHAP attribution proved significantly slower than Grad-CAM, especially on CPU. Running it on every request would have made the interactive demo unusable. The compromise was to keep Grad-CAM as the default explanation and expose SHAP as an optional deeper analysis step.

Class imbalance in the source dataset affected recall on minority classes. Standard weighting and careful split construction mitigated but did not eliminate the issue.

Over-aggressive fine-tuning produced overfitting that was only visible when inspecting explanation maps: high validation accuracy accompanied by heatmaps focused on irrelevant image regions. Early stopping and more conservative learning rates were required.


## Results

The model produces usable four-class predictions on held-out MRI slices. More importantly, the Grad-CAM overlays frequently concentrate on the actual lesion area, giving a practical signal that the network is attending to clinically relevant regions.

Cases where the heatmap focuses elsewhere are now visible instead of hidden. That visibility itself is one of the primary results of the project.


## Lessons Learned

Accuracy alone is an incomplete evaluation metric for medical imaging models. Explanation methods surface failure modes that loss curves and confusion matrices miss.

The choice of target layer for Grad-CAM is an empirical decision that must be validated visually, not only by convention.

Serving explanations through the same API that serves predictions changes how the system is used. Offline notebook visualizations are useful for research; integrated explanations are useful for inspection and communication.

Hardware and latency constraints again shaped design. An explanation method that is theoretically superior but too slow for interactive use is of limited practical value in a demo setting.


## Limitations

This is an educational and research system. It was trained on a public Kaggle dataset, not on institutional clinical data. No radiologist evaluation was performed. Grad-CAM and SHAP provide useful but imperfect signals; they do not constitute a formal causal explanation. The project is explicitly not intended for clinical diagnosis or medical decision-making.


## Future Improvements

- Stronger validation against radiologist annotations
- Exploration of additional explanation methods (Integrated Gradients, attention rollout)
- Calibration of confidence scores
- Containerized deployment with GPU inference
- Larger and more diverse training data if institutional access becomes available

Each of these steps would move the system closer to a research prototype that could be evaluated in a more realistic setting.


## Conclusion

Classification performance and explanation quality are tightly coupled. A model that reaches high accuracy while attending to the wrong image regions is less useful than a slightly less accurate model whose decisions can be inspected and trusted.

This project treats explainability as a first-class requirement rather than an optional post-hoc visualization. The resulting system makes both the prediction and the evidence for that prediction available in a single interactive flow.
