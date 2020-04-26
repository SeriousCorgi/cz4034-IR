#Basic Libraries
import numpy as np
import pandas as pd
import seaborn as sb
sb.set()
import matplotlib.pyplot as plt
import graphviz
import string
import re

from sklearn.model_selection import KFold
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import MaxAbsScaler
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeClassifier
from sklearn import datasets, linear_model
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
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer

import nltk
from nltk import word_tokenize
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer


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

kf = KFold(n_splits=5, shuffle=False)

#Create the classfier
adaNews = AdaBoostClassifier(
    DecisionTreeClassifier(max_depth=5),
    n_estimators=100,
    learning_rate=1
)  

#Train the model using the training sets
adaNews.fit(X, y.values.ravel())

adaNews.score(X, np.ravel(y))
