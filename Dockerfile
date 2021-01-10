FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code/

COPY . /code/
# Install dependencies
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]