from django.template.loader import render_to_string
from weasyprint import HTML
import os
from django.conf import settings
import time
from datetime import datetime
import glob


def generer_carte_mutuelle_pdf(adherent):
    context = {
        'nom': adherent.nom,
        'prenom': adherent.prenom,
        'cin': adherent.cin,
        'nax': adherent.nax,
        'date_recrutement': adherent.date_recrutement.strftime('%d/%m/%Y'),
    }

    html_string = render_to_string('carte_mutuelle.html', context)
    
    # Supprimer les anciens fichiers pour cet adhérent
    cartes_dir = os.path.join(settings.MEDIA_ROOT, 'cartes')
    old_files = glob.glob(os.path.join(cartes_dir, f'carte_{adherent.id}_*.pdf'))
    for old_file in old_files:
        try:
            os.remove(old_file)
        except OSError:
            pass
    
    # Générer avec timestamp unique
    timestamp = int(time.time())
    unique_filename = f'carte_{adherent.id}_{timestamp}.pdf'
    output_path = os.path.join(cartes_dir, unique_filename)
    
    # Créer le dossier s'il n'existe pas
    os.makedirs(cartes_dir, exist_ok=True)
    
    HTML(string=html_string).write_pdf(output_path)
    return output_path

def get_latest_carte_path(adherent):
    """Trouve le fichier de carte le plus récent pour un adhérent"""
    cartes_dir = os.path.join(settings.MEDIA_ROOT, 'cartes')
    pattern = os.path.join(cartes_dir, f'carte_{adherent.id}_*.pdf')
    files = glob.glob(pattern)
    
    if not files:
        # Pas de carte trouvée, en générer une nouvelle
        return generer_carte_mutuelle_pdf(adherent)
    
    # Retourner le fichier le plus récent
    return max(files, key=os.path.getctime)


from django.template.loader import render_to_string
from weasyprint import HTML
import os



def generer_recu_pdf(soin):
    html_string = render_to_string('recu_template.html', {'soin': soin})
    html = HTML(string=html_string)
    
    dossier = 'recu_pdfs'
    os.makedirs(dossier, exist_ok=True)

    chemin_pdf = os.path.join(dossier, f"recu_{soin.num_recu}.pdf")
    html.write_pdf(target=chemin_pdf)

    # Optionnel : tu peux stocker le chemin dans le modèle si besoin
    return chemin_pdf
