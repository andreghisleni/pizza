# Importa a biblioteca pdfkit
import pdfkit
import os

# --- Instruções de Instalação ---
# Para usar esta biblioteca, você precisa ter o wkhtmltopdf instalado no seu sistema.
# O wkhtmltopdf é uma ferramenta de linha de comando que renderiza HTML em PDF.

# Como instalar wkhtmltopdf:
# No Windows:
# Baixe o instalador em https://wkhtmltopdf.org/downloads.html e siga as instruções.
# Certifique-se de adicionar o diretório de instalação do wkhtmltopdf ao seu PATH.

# No macOS (usando Homebrew):
# brew install wkhtmltopdf

# No Linux (Ubuntu/Debian):
# sudo apt-get update
# sudo apt-get install wkhtmltopdf

# Após instalar o wkhtmltopdf, instale a biblioteca pdfkit para Python:
# pip install pdfkit

# --- Configuração do Caminho para wkhtmltopdf (se necessário) ---
# Se o wkhtmltopdf não estiver no seu PATH, você precisará especificar o caminho completo para o executável.
# Por exemplo, no Windows:
# config = pdfkit.configuration(wkhtmltopdf=r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe')
# No Linux/macOS, geralmente não é necessário se estiver no PATH padrão.
# Se você precisar configurar, descomente a linha abaixo e ajuste o caminho:
# path_wkhtmltopdf = r'/usr/local/bin/wkhtmltopdf' # Exemplo para macOS/Linux
# config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

# Se o wkhtmltopdf estiver no PATH do seu sistema, a configuração abaixo é suficiente:
config = pdfkit.configuration() # Configuração padrão, busca wkhtmltopdf no PATH

def generate_pdf_from_url(url, output_filename="output.pdf"):
    """
    Gera um arquivo PDF a partir de uma URL fornecida.

    Args:
        url (str): A URL da página web a ser convertida em PDF.
        output_filename (str): O nome do arquivo PDF de saída.
    """
    try:
        print(f"Tentando gerar PDF de: {url}")
        print(f"Salvando como: {output_filename}")

        # Opções adicionais para o wkhtmltopdf (opcional)
        options = {
            'enable-local-file-access': True, # Permite acesso a arquivos locais (útil para CSS/JS internos)
            'page-size': 'A4',
            'margin-top': '0',
            'margin-right': '0',
            'margin-bottom': '0',
            'margin-left': '0',
            'encoding': "UTF-8",
            'javascript-delay': 2000,
            'images': True, # Habilita o carregamento de imagens
            'no-stop-slow-scripts': True, # Não para scripts lentos
            'run-script': 'window.scrollTo(0, document.body.scrollHeight);'
        }

        # Gera o PDF
        pdfkit.from_url(url, output_filename, configuration=config, options=options)
        print(f"PDF gerado com sucesso: {output_filename}")
    except Exception as e:
        print(f"Ocorreu um erro ao gerar o PDF: {e}")
        print("Certifique-se de que o wkhtmltopdf está instalado e no PATH do seu sistema.")
        print("Se o erro persistir, tente especificar o caminho completo para o executável do wkhtmltopdf na variável 'path_wkhtmltopdf'.")

# --- Exemplo de Uso ---
if __name__ == "__main__":
    # URL que você deseja converter
    target_url = "http://localhost:6010/api/fejoada?start=1&end=600" # Você pode mudar esta URL

    # Nome do arquivo PDF de saída
    pdf_file = "meu_documento.pdf" # Você pode mudar o nome do arquivo

    # Chama a função para gerar o PDF
    generate_pdf_from_url(target_url, pdf_file)

    # Verifica se o arquivo foi criado
    if os.path.exists(pdf_file):
        print(f"O arquivo '{pdf_file}' foi criado na mesma pasta onde o script está sendo executado.")
    else:
        print(f"O arquivo '{pdf_file}' não foi encontrado. Verifique os erros acima.")