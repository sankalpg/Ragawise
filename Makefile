build:
	docker build -t mtg-docker.sb.upf.edu/ragawise .

push:
	docker push mtg-docker.sb.upf.edu/ragawise

.PHONY: build upload
