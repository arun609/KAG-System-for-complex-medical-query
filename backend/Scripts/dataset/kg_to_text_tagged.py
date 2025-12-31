import pandas as pd

# ---------- PATHS ----------
INPUT_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\primekg_extended_final.csv"
OUTPUT_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\primekg_text_corpus_tagged.txt"
# ---------------------------

# load dataset
df = pd.read_csv(INPUT_FILE, low_memory=False)

# normalize columns
df["relation"] = df["relation"].astype(str).str.lower().str.strip()
df["x_type"] = df["x_type"].astype(str).str.lower()
df["y_type"] = df["y_type"].astype(str).str.lower()

# ---------- CLEAN ENTITY ----------
def clean_entity(name):
    name = str(name)
    name = name.replace("(disease)", "")
    name = name.replace("(drug)", "")
    name = name.replace("(protein)", "")
    return name.strip()

# ---------- ROW TO SENTENCE ----------
def row_to_sentence(row):
    x = clean_entity(row["x_name"])
    y = clean_entity(row["y_name"])
    rel = row["relation"]
    x_type = row["x_type"]
    y_type = row["y_type"]

    # 1. Disease – Protein
    if rel == "disease_protein":
        if "disease" in x_type:
            return f"[disease_protein] {x} is associated with the gene {y}."
        else:
            return f"[disease_protein] {y} is associated with the gene {x}."

    # 2. Protein – Protein
    if rel == "protein_protein":
        return f"[protein_protein] Protein {x} interacts with protein {y}."

    # 3. Drug – Protein
    if rel == "drug_protein":
        if "drug" in x_type:
            return f"[drug_protein] Drug {x} targets the protein {y}."
        elif "drug" in y_type:
            return f"[drug_protein] Drug {y} targets the protein {x}."
        else:
            return f"[drug_protein] Drug {x} targets the protein {y}."

    # 4. Disease – Disease
    if rel == "disease_disease":
        return f"[disease_disease] Disease {x} is related to disease {y}."

    # 5. Pathway – Protein
    if rel == "pathway_protein":
        if "pathway" in x_type:
            return f"[pathway_protein] Protein {y} is involved in the biological pathway {x}."
        else:
            return f"[pathway_protein] Protein {x} is involved in the biological pathway {y}."

    # 6. Indication (Drug – Disease) ✅ FINAL FIX
    if rel == "indication":
        if "drug" in x_type and "disease" in y_type:
            return f"[indication] Drug {x} is indicated for the treatment of disease {y}."
        elif "drug" in y_type and "disease" in x_type:
            return f"[indication] Drug {y} is indicated for the treatment of disease {x}."
        else:
            return f"[indication] Drug {x} is indicated for the treatment of disease {y}."

    # fallback
    return f"[other] {x} is biologically related to {y}."

# convert all rows
sentences = df.apply(row_to_sentence, axis=1)

# write corpus
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    for s in sentences:
        f.write(s + "\n")

print("✅ Tagged KG → Text corpus created successfully")
print("Total knowledge facts:", len(sentences))
