
import google.generativeai as genai

genai.configure(api_key="AIzaSyDyY39b832A12wvgwNcOIB7cdY0vZHFYOs")

models = genai.list_models()

for m in models:
    print(m.name)