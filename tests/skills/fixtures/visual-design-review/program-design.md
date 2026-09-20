# Program Design

Gateway owns admission. Gateway calls Billing; Billing records the decision; Gateway returns `accepted`, `rejected`, or `indeterminate`. A Billing timeout returns `indeterminate` without automatic retry.

![Admission overview](/tmp/image-cache/admission-overview.png)

Caption: Generated overview of admission ownership and flow.

Author image-inspection note: the candidate visibly shows Billing calling Database directly and Database returning acceptance to Gateway. The author calls that edge an illustrative simplification. No project-local asset or rendered document preview is available.
