#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para converter HTML de uma URL para PDF usando requests e WeasyPrint
"""

import requests
from weasyprint import HTML, CSS
import os

def url_to_pdf_weasyprint(url, output_filename):
    """
    Converte o conteúdo HTML de uma URL para PDF usando WeasyPrint.
    
    Args:
        url (str): A URL da página HTML.
        output_filename (str): O nome do arquivo PDF de saída.
    
    Returns:
        bool: True se a conversão foi bem-sucedida, False caso contrário.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()  # Levanta um erro para códigos de status HTTP ruins (4xx ou 5xx)
        source_html_content = response.text
        
        # Cria um objeto HTML a partir do conteúdo da string
        html = HTML(string=source_html_content, base_url=url) # base_url é importante para resolver caminhos relativos de CSS/imagens
        
        # --- INÍCIO DA MODIFICAÇÃO ---
        # 1. Define o CSS para configurar o tamanho da página (12cm de largura por 7cm de altura)
        #    A margem de 0.5cm evita que o conteúdo cole nas bordas. Ajuste se necessário.
        page_style = "@page { size: 7cm 12cm; margin: 0cm; }"
        custom_css = CSS(string=page_style)
        # --- FIM DA MODIFICAÇÃO ---


        # Opcional: Se houver CSS externo que precise ser carregado separadamente
        # styles = [CSS(filename='path/to/your/external.css')]
        
        # Gera o PDF, aplicando a folha de estilos customizada
        # O argumento 'stylesheets' espera uma lista de objetos CSS
        html.write_pdf(output_filename, stylesheets=[custom_css])
        
        return True
    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a URL: {e}")
        return False
    except Exception as e:
        print(f"Ocorreu um erro durante a conversão: {e}")
        return False

# Exemplo de uso
if __name__ == "__main__":
    # Substitua esta URL pela sua URL do localhost
    # Certifique-se de que o servidor localhost esteja em execução e acessível
    target_url = "http://localhost:6010/api/fejoada?start=1&end=600"
    pdf_output = "fejoada_weasyprint.pdf"
    
    print(f"Tentando converter a URL: {target_url} para PDF usando WeasyPrint...")
    success = url_to_pdf_weasyprint(target_url, pdf_output)
    
    if success:
        print(f"✅ Conversão bem-sucedida! PDF salvo como: {pdf_output}")
    else:
        print("❌ Erro na conversão da URL para PDF com WeasyPrint. Verifique se o servidor localhost está em execução e a URL está correta.")
