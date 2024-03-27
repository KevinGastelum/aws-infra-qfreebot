FROM public.ecr.aws/lambda/python:3.10

#  Copy reqs
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install reqs.txt
RUN pip install -r requirements.txt

#  Copy files into src directory
COPY src/* ${LAMBDA_TASK_ROOT}

# Set your handler file
CMD [ "main.handler" ]