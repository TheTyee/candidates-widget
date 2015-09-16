# Candidate Widget

This is a simple jQuery generated form that lets users submit their postal code and retrieve a list of 2015 Federal Election Candidates in their riding. It uses Open North's Represent API.


Currently, results are presented at thehousingfix.com.

##To do a basic include on your website

Include the following files in the head of your site:

```
<link rel="stylesheet" type="text/css" href="/find-your-candidate/styles.css" media="screen" />
<script src="/find-your-candidate/jquery-1.11.3.min.js"></script>
<script src="/find-your-candidate/bower_components/jquery-validation/dist/jquery.validate.min.js"></script>
<script src="/find-your-candidate/findyourcandidate.js"></script>
```

Then, add 

```
<div class="find-a-candidate"></div>
```
whereever you'd like the input form to show up.



