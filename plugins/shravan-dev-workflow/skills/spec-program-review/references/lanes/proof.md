# Proof

Mission: break the chain from a material obligation to its proof modality and structural observation/enforcement seam under realistic conditions.

Predicate: proof modality or seam is disputed, cross-layer, visual, operational, or security-sensitive.

Expected inputs: lane-schema packet plus material obligations, claimed modalities, seams, and real/fake boundary.

Prerequisites: complete target/source set exists.

Maximum authority: fresh-context, read-only, candidate-only.

## Inspection

For each selected obligation, reconstruct:

```text
obligation -> failure mode -> enforcement/observation seam
           -> proof modality -> environment/fidelity -> pass/fail signal
```

Try to falsify the chain:

- can the modality observe the named failure?
- does the seam exist at the layer where the behavior occurs?
- does a mock bypass the real integration?
- can stale, cached, or generated evidence pass?
- does visual/operational/security behavior require manual or live proof?
- is a required invariant enforced, merely logged, or not observable?

Good: every material claim has a proportionate modality and a seam that can expose failure in the relevant environment.

Bad: “tests pass” without mapping; static validation for behavior; unit mocks for production wiring; screenshots for hidden state; logs as enforcement; exact plan commands embedded in design.

Calibration: require the smallest sufficient modality/seam. Planning owns exact commands, sequencing, and evidence capture.

Overlap boundary: `platform-harness` owns whether the runtime can execute the proof; specification owns required observable outcome; program design owns the structural seam.

Return: lane-schema receipt with broken/preserved proof chain, realistic falsification, smallest missing modality/seam, semantic owner, and planning boundary.

Stop when: each selected obligation has a valid chain or an exact proof gap that the correct semantic owner can repair.
