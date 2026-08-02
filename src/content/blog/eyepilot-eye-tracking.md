# Eye-Controlled Mouse Interaction with MediaPipe

Hands-free computer control remains difficult to make reliable under ordinary webcam conditions. Lighting changes, head movement, and natural eye jitter all degrade simple gaze estimation.

This project implements a complete desktop system that maps eye gaze to cursor movement and blinks to mouse clicks, with calibration, smoothing, and a dedicated interface for configuration and feedback.


## Problem Statement

Traditional assistive pointing devices are expensive or require specialized hardware. Webcam-based eye tracking is attractive because the sensor is already present on most machines, yet the signal is noisy and the mapping from pupil position to screen coordinates is non-linear and user-specific.

Existing prototypes often demonstrate tracking in isolation. Turning that tracking into usable mouse control requires calibration, temporal filtering, gesture recognition, and a practical user interface — the engineering layers that determine whether the system is usable beyond a short demo.


## Project Overview

EyePilot AI is a Windows desktop application that enables:

- Real-time gaze estimation from a standard webcam
- Cursor control driven by eye position
- Left-click, right-click, and double-click via blink patterns
- Optional eye-controlled screen recording
- A five-point calibration procedure
- Adjustable sensitivity and smoothing
- Live preview with facial landmarks
- Session statistics

The system is built around MediaPipe Face Mesh for landmark detection and PyQt6 for the control interface.


## System Architecture

```
Webcam frame
      │
      ▼
MediaPipe Face Mesh
      │
      ├── Iris / eye landmarks
      │
      ▼
Gaze estimation + calibration transform
      │
      ▼
Smoothing filter
      │
      ├── Cursor position (PyAutoGUI)
      │
      └── Blink detector
                │
                ├── Single blink → left click
                ├── Longer / patterned blink → right / double click
                └── Recording controls
```

Calibration computes a mapping from normalized eye coordinates to screen space. Subsequent frames apply that mapping and a temporal filter before moving the cursor.


## Technology Stack and Design Decisions

**MediaPipe Face Mesh** supplies dense, real-time facial landmarks including iris positions. It was chosen because it runs efficiently on CPU and provides stable landmarks under moderate head movement, reducing the need for a custom detector.

**PyAutoGUI** handles OS-level mouse movement and clicks. This keeps the control layer simple and portable across standard Windows environments.

**PyQt6** provides the application shell: live camera view, calibration UI, sensitivity controls, and status displays. A native desktop interface was preferred over a browser-based one for low-latency feedback and system-level mouse control.

**OpenCV** is used for camera capture and basic image utilities. **NumPy** supports the geometric and filtering calculations. **MSS** is used for screen capture when recording is enabled.


## Implementation Details

### Gaze Pipeline
Each frame is processed by MediaPipe. Selected eye landmarks are converted into a normalized gaze vector. After calibration, this vector is transformed into screen coordinates.

### Calibration
A five-point procedure asks the user to look at known screen locations. The collected correspondences are used to fit a mapping (typically an affine or similar transform) from eye space to screen space. Calibration is required per user and per session for acceptable accuracy.

### Smoothing
Raw gaze estimates are noisy. A configurable smoothing filter reduces jitter at the cost of a small lag. Sensitivity and smoothing parameters are exposed in the UI so users can trade responsiveness against stability.

### Blink Gestures
Blink detection operates on the eye aspect ratio or equivalent landmark distances over short temporal windows. Distinct patterns are mapped to left click, right click, and double click. Thresholds are adjustable because blink dynamics vary across users.

### Screen Recording
An optional mode allows start/stop of screen recording through the same eye-control channel, using MSS for capture.


## Challenges and Trade-offs

Gaze accuracy degrades with head pose changes and uneven lighting. The five-point calibration helps for a fixed head position but does not fully compensate for large movements. Additional head-pose compensation was left for future work.

Blink detection must distinguish intentional gestures from natural blinks. Overly sensitive thresholds produce accidental clicks; overly strict thresholds make intentional clicks unreliable. User-adjustable parameters were the practical solution.

Smoothing introduces latency. Aggressive filtering stabilizes the cursor but makes fine targeting harder. The UI exposes the trade-off rather than hard-coding a single value.

Running continuous face-mesh inference, filtering, and UI updates on CPU requires careful frame handling to maintain interactive rates. Dropping frames under load is preferable to blocking the mouse control loop.


## Results

With successful calibration and reasonable lighting, the system provides usable cursor control and click gestures for basic desktop navigation and simple tasks. Accuracy is sufficient for demonstration and for users who can maintain a relatively stable head position.

The live landmark preview and session statistics make the behavior of the tracker observable, which is essential for diagnosing calibration or lighting problems.


## Lessons Learned

Calibration is not a one-time setup step; it is part of the core interaction loop. Systems that skip or hide calibration tend to feel broken under real conditions.

Temporal filtering and gesture timing are as important as the underlying landmark detector. Most usability issues appeared in these layers rather than in MediaPipe itself.

Exposing sensitivity and smoothing controls to the user is more effective than trying to find a universal default. Individual variation is large.


## Limitations

The system assumes a single user, a relatively stable head pose, and adequate frontal lighting. It does not currently compensate for large head rotations or multi-monitor configurations. Accuracy remains lower than dedicated eye-tracking hardware. Blink gesture recognition can still produce false positives or missed clicks under rapid blinking or fatigue.


## Future Improvements

- Head-pose compensation to improve robustness
- Multi-monitor support
- Additional gesture vocabulary
- Optional voice command layer
- Improved calibration with more points or continuous adaptation


## Conclusion

Reliable eye control is less about the landmark detector and more about the surrounding engineering: calibration, filtering, gesture logic, and feedback. MediaPipe provides a strong foundation; the rest of the system determines whether that foundation becomes usable interaction.
