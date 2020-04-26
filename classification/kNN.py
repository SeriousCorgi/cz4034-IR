#Basic Libraries
import numpy as np
import pandas as pd
import seaborn as sb
import matplotlib.pyplot as plt
sb.set()
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import cross_val_score
from sklearn.tree import export_graphviz
from sklearn import preprocessing
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.naive_bayes import GaussianNB
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
import graphviz
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
import nltk
from nltk import word_tokenize
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer
import string
import re

#Import training data
train_excel = pd.read_excel('training_data_excel.xlsx')

#Preprocessing

#Remove Stopwords
nltk.download('stopwords')
stop = stopwords.words('english')
train_excel['text_without_stopwords'] = train_excel['text'].apply(lambda x: ' '.join([word for word in x.split() if word not in (stop)]))

#Remove URLs
train_excel['final_text'] = train_excel['text_without_stopwords'].apply(lambda x: re.split('https:\/\/.*', str(x))[0])

#Lowercase words
train_excel['final_text'] = train_excel['final_text'].str.lower()

#Remove punctuation
train_excel['final_text'] = train_excel['final_text'].str.replace(r'[^\w\s]+', '') #remove punctuation

#Stem words
ps = PorterStemmer()
train_excel['final_text'] = train_excel['final_text'].apply(lambda x: ' '. join([ps.stem(word) for word in x.split() ]))

#Lemmatize words
nltk.download('wordnet')
lmtzr = WordNetLemmatizer()
train_excel['final_text'] = train_excel['final_text'].apply(lambda x: ' '. join([lmtzr.lemmatize(word, 'v') for word in x.split() ]))

train_excel.head()

#TFIDF conversion
count_vect = CountVectorizer(stop_words='english')
X_train_counts = count_vect.fit_transform(train_excel['final_text'])
count_vect.vocabulary_.get(u'algorithm')
train_list = count_vect, X_train_counts
train_count_vect = train_list[0]
train_vector = train_list[1]
train_tfidf = TfidfTransformer(use_idf=True).fit_transform(train_vector)

#Extract Response and Predictors
y = pd.DataFrame(train_excel['category'])
X = train_tfidf

#Split the Dataset into Train and Test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.30)

#Create the classfier
knn2 = KNeighborsClassifier()
#Create a dictionary of all values we want to test for n_neighbors
param_grid = {"n_neighbors": np.arange(1, 25)}
#Use gridsearch to test all values for n_neighbors
knn_gscv = GridSearchCV(knn2, param_grid, cv=5, iid=True)
#Fit model to data
knn_gscv.fit(X, y.values.ravel())
#Check top performing n_neighbors value
print("best n_neighbors:", knn_gscv.best_params_)
#Check mean score for the top performing value of n_neighbors
print("best score:", knn_gscv.best_score_)

# Create KNN classifier
knnNews = KNeighborsClassifier(n_neighbors = knn_gscv.best_score_)

# Fit the classifier to the data
knnNews.fit(X_train,y_train.values.ravel())

#Check the Goodness of Fit (on Train Data)
print("Goodness of Fit of Model \tTrain Dataset")
print("Classification Accuracy \t:", adaATK.score(X_train, y_train))
print()

#Check the Goodness of Fit (on Test Data)
print("Goodness of Fit of Model \tTest Dataset")
print("Classification Accuracy \t:", adaATK.score(X_test, y_test))
print()

#Confusion matrix
#Predict Response corresponding to Predictors
y_train_pred = adaATK.predict(X_train)
y_test_pred = adaATK.predict(X_test)

#Plot the Confusion Matrix for Train and Test
f, axes = plt.subplots(1, 2, figsize=(12, 4))
sb.heatmap(confusion_matrix(y_train, y_train_pred),
           annot = True, fmt=".0f", annot_kws={"size": 18}, ax = axes[0])
sb.heatmap(confusion_matrix(y_test, y_test_pred), 
           annot = True, fmt=".0f", annot_kws={"size": 18}, ax = axes[1])

#Import test data
test_excel = pd.read_excel('test_data_excel.xlsx')

#Same preprocessing steps
test_excel['text_without_stopwords'] = test_excel['text'].apply(lambda x: ' '.join([word for word in x.split() if word not in (stop)]))
test_excel['final_text'] = test_excel['text_without_stopwords'].apply(lambda x: re.split('https:\/\/.*', str(x))[0])
test_excel['final_text'] = test_excel['final_text'].str.lower()
test_excel['final_text'] = test_excel['final_text'].str.replace(r'[^\w\s]+', '')
ps = PorterStemmer()
test_excel['final_text'] = test_excel['final_text'].apply(lambda x: ' '. join([ps.stem(word) for word in x.split() ]))
lmtzr = WordNetLemmatizer()
test_excel['final_text'] = test_excel['final_text'].apply(lambda x: ' '. join([lmtzr.lemmatize(word, 'v') for word in x.split() ]))

#TFIDF conversion
test_vector = count_vect.transform(test_excel['final_text'])
test_tfidf = TfidfTransformer(use_idf=True).fit_transform(test_vector)

#Apply trained model
X_pred = test_tfidf
y_pred = knnNews.predict(X_pred)

#Combining datasets
category = pd.DataFrame(data=y_pred, columns=["category"])
category.head()
combine = pd.concat([test_excel, category], axis = 1)
combine.head()

#Output to excel
combine.to_excel("output.xlsx") 



