import pandas as pd

INPUT_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\primekg_extended.csv"
OUTPUT_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\primekg_extended_final.csv"

# load safely
df = pd.read_csv(INPUT_FILE, low_memory=False)

# normalize relation names
df["relation"] = df["relation"].astype(str).str.lower().str.strip()

# keep all clinically important relations
keep_full = df[df["relation"].isin([
    "disease_protein",
    "drug_protein",
    "indication"
])]

# relation-aware sampling
protein_protein = df[df["relation"] == "protein_protein"].sample(frac=0.08, random_state=42)
pathway_protein = df[df["relation"] == "pathway_protein"].sample(frac=0.20, random_state=42)
disease_disease = df[df["relation"] == "disease_disease"].sample(frac=0.35, random_state=42)

# combine everything
final_df = pd.concat([
    keep_full,
    protein_protein,
    pathway_protein,
    disease_disease
]).drop_duplicates()

# save final dataset
final_df.to_csv(OUTPUT_FILE, index=False)

print("✅ Relation-aware downsampling completed")
print("Final rows:", len(final_df))
print("\nRelation distribution:")
print(final_df["relation"].value_counts())
