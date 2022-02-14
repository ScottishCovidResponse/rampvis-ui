import { HealthAndSafety } from "@mui/icons-material";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormGroup,
  Checkbox,
} from "@mui/material";
import MathJax from "react-mathjax";
const inlineFormula = `k_{n+1} = n^2 + k_n^2 - k_{n-1}`;
const blockFormula = `\\int_0^\\infty x^2 dx`;
const timeseriesFormula = `\\pmb{t} = \\{t_\\mathrm{1},t_\\mathrm{2},\\cdots,t_\\mathrm{n}\\}`;
const multiTimeseries = `\\pmb{T}_\\mathrm{d,c} =\\{\\pmb{t}_\\mathrm{d,c}^{(\\mathrm{1})},\\mathbf{t}_\\mathrm{d,c}^{(\\mathrm{2})},\\cdots,\\pmb{t}_\\mathrm{d,c}^{(n_\\mathrm{i})}\\}^\\top`;
const timeseriesMatrix = `\\mathrm{TSDB}_\\mathrm{n_\\mathrm{d} \\times n_\\mathrm{c}} = 
\\begin{pmatrix}
\\pmb{T}_\\mathrm{1,1}  & \\pmb{T}_\\mathrm{1,2}  & \\cdots & \\pmb{T}_\\mathrm{1,n_\\mathrm{c}}  \\\\
\\pmb{T}_\\mathrm{2,1}  & \\pmb{T}_\\mathrm{2,2}  & \\cdots & \\pmb{T}_\\mathrm{2,n_\\mathrm{c}} \\\\
\\vdots & \\ddots  & \\ddots & \\vdots \\\\
\\pmb{T}_\\mathrm{n_\\mathrm{d},1}  & \\cdots  & \\cdots & \\pmb{T}_\\mathrm{n_\\mathrm{d},n_\\mathrm{c}}
\\end{pmatrix}`;
const slicedMatrix = `\\mathrm{TSDF}_\\mathrm{n_\\mathrm{d} \\times n_\\mathrm{c}} = 
\\begin{pmatrix}
\\pmb{t}_\\mathrm{1,1}  & \\pmb{t}_\\mathrm{1,2}  & \\cdots & \\pmb{t}_\\mathrm{1,n_\\mathrm{c}}  \\\\
\\pmb{t}_\\mathrm{2,1}  & \\pmb{t}_\\mathrm{2,2}  & \\cdots & \\pmb{t}_\\mathrm{2,n_\\mathrm{c}} \\\\
\\vdots & \\ddots  & \\ddots & \\vdots \\\\
\\pmb{t}_\\mathrm{n_\\mathrm{d},1}  & \\cdots  & \\cdots & \\pmb{t}_\\mathrm{n_\\mathrm{d},n_\\mathrm{c}}
\\end{pmatrix}`;
const distanceScore = `d(\\pmb{x},\\pmb{y}) = a`;
const similarityScore = `s(\\pmb{x},\\pmb{y}) = 1 - d(\\pmb{x},\\pmb{y})`;
const distanceMeasureTable = `
\\begin{array}{|c|c|}
\\hline
\\hline
\\
\\text{} & \\text{Equation}  
\\\\
\\hline
\\\\
\\text{Minkowski} & d_\\mathrm{p} : (\\pmb{x},\\pmb{y}) \\longmapsto ||\\pmb{x}-\\pmb{y}||_p = \\Big(\\sum_{i=1}^n|x_i-y_i|^p\\Big)^\\frac{1}{p}
\\\\
\\text{Manhattan} & d_\\mathrm{1} : (\\pmb{x},\\pmb{y}) \\longmapsto ||\\pmb{x}-\\pmb{y}||_1 = \\sum_{i=1}^n |x_i - y_i|
\\\\
\\text{Euclidean} & d_2  :  (\\pmb{x},\\pmb{y}) \\longmapsto ||\\pmb{x}-\\pmb{y}||_2 = \\sqrt{\\sum_{i=1}^n (x_i - y_i)^2} 
\\\\
\\text{Sum of Squared} &d_\\mathrm{SSD} : (\\pmb{x},\\pmb{y}) \\longmapsto d_2^2 = ||\\pmb{x}-\\pmb{y}||_2^2 = \\sum_{i=1}^n (x_i - y_i)^2
\\\\
\\text{Mean Squared} & d_\\mathrm{MSE} : (\\pmb{x},\\pmb{y}) \\longmapsto \\frac{d_\\mathrm{SSD}}{n} = \\frac{||\\pmb{x}-\\pmb{y}||_2^2}{n} = \\frac{1}{n}\\sum_{i=1}^n (x_i - y_i)^2
\\\\
\\text{Chebyshev} &   d_\\infty : (\\pmb{x},\\pmb{y}) \\longmapsto ||\\pmb{x}-\\pmb{y}||_\\infty = \\lim_{p \\rightarrow \\infty}\\Big(\\sum_{i=1}^n (x_i - y_i)^p\\Big)^{\\frac{1}{p}}
\\\\
\\text{Canberra} & d_\\mathrm{CAD} : (\\pmb{x},\\pmb{y}) \\longmapsto \\sum_{i=1}^n \\frac{|x_i-y_i|}{|x_i|+|y_i|}
\\\\
\\text{Bray-Curtis} & d_\\mathrm{BC} : (\\pmb{x},\\pmb{y}) \\longmapsto  \\frac{\\sum_{i=1}^n|x_i-y_i|}{\\sum_{i=1}^n|x_i+y_i|}
\\\\
\\\\
\\hline
\\hline
\\end{array}`;
const compressionMeasureTable = `
\\begin{array}{|c|c|}
\\hline
\\hline
\\
\\text{} & \\text{Equation}  
\\\\
\\hline
\\\\
\\text{Pearson's Correlation} & s_\\mathrm{pr} :  (\\pmb{x},\\pmb{y}) \\longmapsto \\frac{\\sum_{i=1}^{n}(x_i - \\mu_x)\\sum_{i=1}^{n}(y_i - \\mu_y)}{\\sqrt{\\sum_{i=1}^{n}(x_i-\\mu_x)^2\\sum_{i=1}^{n}(y_i-\\mu_y)^2}}
\\\\
\\text{Cosine Similarity} & s_\\mathrm{cos} : (\\pmb{x},\\pmb{y}) \\longmapsto \\frac{\\big< \\pmb{x},\\pmb{y} \\big>}{||\\pmb{x}||_2||\\pmb{y}||_2} = \\frac{\\sum_{i=1}^n x_iy_i}{\\sqrt{\\sum_{i=1}^{n}x_i^2}\\sqrt{\\sum_{i=1}^{n}y_i^2}} 
\\\\
\\\\
\\hline
\\hline
\\end{array}`;

const dtwAlgo = `\\begin{algorithm}[H]
\\setstretch{1.2}{
\\SetAlgoLined
\\KwIn{Two time-series objects $\\pmb{x}: [x_1,..,x_n]$ and $\\pmb{y} : [y_1,...,y_m]$, distance measure $d(\\pmb{x},\\pmb{y})$}
\\KwOut{Distance $d_\\mathrm{DTW}(\\pmb{x},\\pmb{y})$ between time-series objects }
DTW = zeros(n,m) \\;
\\For{$i\\leftarrow 1$ \\KwTo $n$}{ \\For{$j\\leftarrow 1$\\KwTo $m$}{DTW[$i,j$] = $\\infty $}}
DTW[$0,0$] = $0$ \\; 
\\For{$i\\leftarrow 1$ \\KwTo $n$}{ \\For{$j\\leftarrow 1$ \\KwTo $m$}{cost = d($x[i],y[j]$)\\;
DTW[$i,j$]  = cost + $\\min$\\{ DTW[$i-1,j$] ,DTW[$i,j-1$],  DTW[$i-1,j-1$]\\}}}
\\KwRet{$\\mathrm{DTW[n,m]}$}}
\end{algorithm}
`;

function InfoPopUp(props) {
  return (
    <div className={props.className}>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={props.open}
      >
        ?
      </Button>

      <Dialog
        fullScreen
        open={props.state}
        onClose={props.close}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Time-period Search Info Screen
        </DialogTitle>
        <DialogContent>
          <MathJax.Provider>
            <div>
              <h2>Time-series similarity matching</h2>
              <p>
                {" "}
                A time-series is an ordered sequence which represents
                observations that changes over time [24]. It is represented as{" "}
                <MathJax.Node inline formula={timeseriesFormula} /> where{" "}
                <MathJax.Node inline formula={`\\mathrm{n}`} /> is the last
                element and length of the time-series object. For the
                covid-data, a time-series database is created. For one country,
                there are several indicators introducing multi-dimensional data
                (cases, deaths, icu admissions, tests). For a particular date
                and country, multi-dimensional time-series data is represented
                as <MathJax.Node inline formula={multiTimeseries} /> where{" "}
                <MathJax.Node inline formula={`\\mathrm{d}`} /> is date,{" "}
                <MathJax.Node inline formula={`\\mathrm{c}`} /> is country and{" "}
                <MathJax.Node inline formula={`\\mathrm{n}_\\mathrm{i}`} />
                is the number of indicators. The time-series database is
                structured as follows:
                <MathJax.Node formula={timeseriesMatrix} />
                where{" "}
                <MathJax.Node inline formula={`\\mathrm{n}_\\mathrm{d}`} /> is
                the number of dates and{" "}
                <MathJax.Node inline formula={`\\mathrm{n}_\\mathrm{c}`} /> is
                the number of countries.
              </p>
              <p>
                The tool's aim is to rank and display statistically closest
                temporal movements given a query time-series. This is solved by
                defining a similarity or distance measure between the
                time-series object to estimate how close the temporal movements
                are [25]. The distance and similarity score between two
                time-series objects x and y are defined as [25]:
                <MathJax.Node formula={distanceScore} />
                <MathJax.Node formula={similarityScore} /> where{" "}
                <MathJax.Node inline formula={`a`} /> is scalar. There are two
                frameworks on time-series matching which are [26] whole series
                and subsequent matching. The former uses the whole length of the
                time-series and computes similarity between all objects in the
                database. The latter takes a shorter time-series as the query
                input and finds matches from longer time-series. In this tool,
                whole time-series matching is used.
              </p>
              <p>
                Given a query time-series,(ex: last month's biweekly cases per
                million for France) the system creates a dataframe which gathers
                all available countries data on the given indicator. Then using
                a window function, a new dataframe generated storing
                same-lengthed time-series in each cell using the query length.
                The generated dataframe TSDF can be represented as follows:
                <MathJax.Node formula={slicedMatrix} />
                The column values are country names and the indexes correspond
                to the last date of the corresponding time-series. A sample
                dataframe is shown below:
                <div style={{ textAlign: "center" }}>
                  <img height={400} src="/static/timeseries-sim/tsdf.png" />
                </div>
                Using the similarity measure chosen by the user, the similarity
                between query and each cell are calculated to create a new
                dataframe in same dimensions but with scalar distance scores in
                each cell. This dataframe are then vectorized and most similar
                time-series are sorted and sent back to visualize.
              </p>
              <h2>Similarity measures</h2>
              <p>
                Distance measures can be categorized in numerous ways. Some
                algorithms favors the similarity in the linear relationship of
                the curves [29], others favor the similarity in time by using
                one-to-one point alignment [30]. For longer time-series, there
                are model-based (ARIMA) [31] and feature based (DFT) [32]
                algorithms which fit the time-series into a parametric model or
                extract features using dimension reduction methods respectively.
                The distance measures available tool are divided into two
                categories (lock-step and elastic measures) by how the points
                from two time-series objects can align. Distance measures can be
                categorized in numerous ways. Some algorithms favors the
                similarity in the linear relationship of the curves [29], others
                favor the similarity in time by using one-to-one point alignment
                [30]. For longer time-series, there are model-based (ARIMA) [31]
                and feature based (DFT) [32] algorithms which fit the
                time-series into a parametric model or extract features using
                dimension reduction methods respectively. The distance measures
                availables are divided into two categories (lock-step and
                elastic measures) by how the points from two time-series objects
                can align.
              </p>
              <h3>Lock-step measures</h3>
              <p>
                Lock step measures compare the points at the exact same temporal
                position [42]. The most used lock step measure to compare
                time-series is the Minkowski distance, also known as Lp norm
                [42]. For p = 1, the distance measure is called Manhattan or
                city-block distance. This uses the absolute value of the
                difference between time-points [43]. For p = 2, Euclidean
                distance is obtained [43]. This measure is the most common
                method used for one dimensional applications, but for higher
                dimensions, Manhattan distance is more preferable [44]. Both
                distance measures are sensitive to noises [43]. If there is a
                high amplitude noise in the signal, all of the score is
                dominated by this point as the distance measures sum up the
                difference values of corresponding points. This effect increases
                naturally as p is increased. For the limit p → ∞, Chebyshev
                distance is obtained which takes the maximum distance between
                all temporal pairs [43].
              </p>
              <MathJax.Node formula={distanceMeasureTable} />
              <p>
                Sum of Squared distance is the squared version of Euclidean
                distance. Due to disappearance of square root in the calculation
                of distance score, this method is faster when computing. Mean
                squared distance is also derived from the Euclidean distance by
                squaring and dividing by the number elements. The ranking of
                distance scores are done using same length
                time-series;therefore, there is no difference on results created
                by Euclidean, squared, mean squared distance. Canberra and
                Bray-Curtis distance measures are modifications of Manhattan
                distance by weighting the difference by the values of the
                temporal points [45]. The main problem using those metrics is
                that if the compared points are both close to the origin, the
                distance score gets significantly large due to the denominator.
                Secondly, all the time-series compared in the system is
                non-negative. Therefore, the results obtained from these
                measures will be the same.
              </p>
              <p>
                The second category in the lock-step measures is the
                compression-based family. The idea and the name comes from the
                notion of the algorithms such that it measures how much
                information or compression can be obtained by knowing one of the
                compared time-series [47]. These are mainly used in text and
                media mining [48]. Pearson's correlation distance uses the
                co-variance between the time-series [48]. If only correlation
                index is used, the output ranges from -1 to 1 with 1 indicating
                that there is perfect positive linear relationship between
                time-series. A correlation of 0 means that two series are
                independent. To obtain a distance measure, the result is
                subtracted from 1, resulting a new range from 0 to 2. Cosine
                distance evaluates the cosine angle between the temporal points
                [47]. It's a special case of the Pearson's correlation distance
                when the mean of both time-series is equal to zero. This method
                is invariant to rotations.
              </p>
              <MathJax.Node formula={compressionMeasureTable} />
              <p>
                Compression-based metrics favor the shape of the curve rather
                than the amplitude and are all invariant to uniform amplitude
                scaling and offset. Therefore, if the amplitudes of the curves
                are important in the ranking system, they would behave poorly.
              </p>
              <h3>Elastic measures</h3>
              <p>
                Elastic measures are more complex algorithms that are able to
                work with time-series with different length and sampling rate
                [42]. Unlike the lock-step measure approach, they allow elastic
                temporal alignments in the time-series. Dynamic time warping
                (DTW) and longest common sub-sequence (LCS) algorithms are
                available in the tool. The pseucode for the algorithms are shown
                below. Euclidean distance is chosen as the metric to be used in
                both elastic measures.
                <div style={{ display: "flex" }}>
                  <div style={{ textAlign: "center" }}>
                    <img height={400} src="/static/timeseries-sim/dtw.png" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <img height={500} src="/static/timeseries-sim/lcs.png" />
                  </div>
                </div>
              </p>
              <p>
                DTW algorithm calculates the perfect alignment between the
                time-series objects. This algorithm takes two time-series
                objects and transforms their time alignment into a warped time
                shape by using repeated/removed temporal points [56]. It allows
                for one-to-many and many-to-one matching between temporal points
                [56]. This is done by generating a distance matrix from time
                series and finding the distance path corresponding to minimal
                cost from the origin to the end-point [56]. For two time-series
                x and y with lengths n and m respectively, the algorithm has a
                time complexity of O(nm) which is significant as all the
                shape-based features have a complexity of O(n) and all the
                compression-based O(3n) .DTW algorithm calculates the perfect
                alignment between the time-series objects. This algorithm takes
                two time-series objects and transforms their time alignment into
                a warped time shape by using repeated/removed temporal points
                [56]. It allows for one-to-many and many-to-one matching between
                temporal points [56]. This is done by generating a distance
                matrix from time series and finding the distance path
                corresponding to minimal cost from the origin to the end-point
                [56]. For two time-series x and y with lengths n and m
                respectively, the algorithm has a time complexity of O(nm) which
                is significant as all the shape-based features have a complexity
                of O(n) and all the compression-based O(3n).
              </p>
              One disadvantage of the DTW algorithm is due to the matching of
              all points. As shown below, the outliers and noise in the
              time-series effect the resulting distance score. LCS does not
              suffer from this problem as the algorithm does not match all the
              points but looks for similar sub-sequences inside the compared
              time-series [61]. Secondly it has two inputs for adjusting both
              the distance threshold and the maximum number of allowed shift for
              alignment which are ε and δ respectively [62]. If the objects in
              the time-series database are close to each other, a small value of
              ε causes reduced extracted features which makes harder to rank. As
              the value of ε tends to infinity, the paths calculated by the
              algorithm become the same as that calculated by the lock-step
              measures.
              <div style={{ textAlign: "center" }}>
                <img height={800} src="/static/timeseries-sim/alignment.png" />
              </div>
            </div>
          </MathJax.Provider>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InfoPopUp;
